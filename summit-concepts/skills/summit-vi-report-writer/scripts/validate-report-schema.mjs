#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';
import {
  CONTROL_DIMENSIONS,
  STANDARD_DIMENSIONS,
  SUPPORTED_WIDGETS,
  candidateBaseName,
  collectPaths,
  countDiagnostics,
  diagnostic,
  duplicateValues,
  getPanels,
  getToolbars,
  getViews,
  jsonType,
  isMain,
  optionList,
  parseCli,
  readJsonDocument,
  requireObject,
  sha256,
  walkStrings,
  writeResultPair
} from './validation-core.mjs';

const allowlist = JSON.parse(await readFile(new URL('../references/schema-allowlist.json', import.meta.url), 'utf8'));
const allowedByPath = new Map(allowlist.allowedPaths.map((entry) => [entry.path, entry]));
const deniedByPath = new Map(allowlist.deniedPaths.map((entry) => [entry.path, entry]));
const unresolvedByPath = new Map(allowlist.unresolvedPaths.map((entry) => [entry.path, entry]));

function pushRequired(diagnostics, object, keys, path) {
  for (const key of keys) {
    if (!Object.hasOwn(object || {}, key)) {
      diagnostics.push(diagnostic('error', 'SCHEMA_REQUIRED_FIELD', `${path}.${key}`, `Required field ${key} is missing.`, 'Add the field using the routed reference grammar.'));
    }
  }
}

function pushDuplicateDiagnostics(diagnostics, items, key, path, code) {
  for (const value of duplicateValues(items, key)) {
    diagnostics.push(diagnostic('error', code, path, `Duplicate ${key} value ${JSON.stringify(value)}.`, `Give every ${key} a unique confirmed value.`));
  }
}

function equalJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function validateAllowlist(document, sourceDocument, mode, diagnostics) {
  const sourcePaths = new Map((sourceDocument ? collectPaths(sourceDocument.value) : []).map((entry) => [entry.path, entry]));
  for (const entry of collectPaths(document.value)) {
    const allowed = allowedByPath.get(entry.pattern);
    const denied = deniedByPath.get(entry.pattern);
    const unresolved = unresolvedByPath.get(entry.pattern);
    if (allowed) {
      if (allowed.types?.length && !allowed.types.includes(entry.type)) {
        diagnostics.push(
          diagnostic('error', 'SCHEMA_TYPE', entry.path, `Expected ${allowed.types.join(' or ')}, received ${entry.type}.`, 'Use the exact type documented by the portable schema catalogue.')
        );
      }
      continue;
    }

    const classification = denied ? 'denied' : unresolved ? 'unresolved' : 'unknown';
    const sourceEntry = sourcePaths.get(entry.path);
    const unchanged = sourceEntry && equalJson(sourceEntry.value, entry.value);
    if (mode === 'modify' && unchanged) {
      diagnostics.push(
        diagnostic('warning', `SCHEMA_${classification.toUpperCase()}_PRESERVED`, entry.path, `Preserved ${classification} source path unchanged.`, 'Keep it outside change scope and retain the change-comparison proof.')
      );
    } else {
      diagnostics.push(
        diagnostic(
          'error',
          `SCHEMA_${classification.toUpperCase()}_PATH`,
          entry.path,
          `${classification[0].toUpperCase()}${classification.slice(1)} path is not allowed for this candidate.`,
          mode === 'modify' ? 'Revert it to the exact source value or obtain reviewed evidence.' : 'Remove it or use an approved routed pattern.'
        )
      );
    }
  }
}

function validateRuleScopes(report, diagnostics) {
  const expression = /IQe\.RuleScope\(([^)]*)\)/g;
  walkStrings(report, (text, path) => {
    for (const match of text.matchAll(expression)) {
      const pairs = match[1]
        .split(',')
        .map((item) => item.trim().split(':'))
        .filter((item) => item.length === 2);
      const dimensions = pairs.map(([dimension]) => dimension);
      const complete = STANDARD_DIMENSIONS.every((dimension) => dimensions.includes(dimension)) && dimensions.length === STANDARD_DIMENSIONS.length;
      const validValues = pairs.every(([, value]) => ['First', 'Last'].includes(value));
      if (!complete || !validValues) {
        diagnostics.push(
          diagnostic(
            'error',
            'SCHEMA_RULE_SCOPE',
            path,
            'IQe.RuleScope must enumerate all seven standard dimensions exactly once using First or Last.',
            'Use Product, Market, Date, Time, Promotion, Shopper, and Basket; all-First is the safe default.'
          )
        );
      }
    }
  });
}

function validatePages(report, diagnostics) {
  const pages = report.Pages;
  pushDuplicateDiagnostics(diagnostics, pages, 'Index', 'Pages', 'SCHEMA_DUPLICATE_PAGE_INDEX');
  const inputKeys = [];
  pages.forEach((page, pageIndex) => {
    const pagePath = `Pages[${pageIndex}]`;
    if (!requireObject(page)) return;
    if (Object.hasOwn(page, 'Input')) {
      if (!requireObject(page.Input)) {
        diagnostics.push(diagnostic('error', 'SCHEMA_PAGE_INPUT_OBJECT', `${pagePath}.Input`, 'Page Input must be an object.', 'Replace the bare value with the documented Input object.'));
      } else {
        pushRequired(diagnostics, page.Input, ['Key', 'Options'], `${pagePath}.Input`);
        if (page.Input.Key) inputKeys.push(page.Input.Key);
        if (!Array.isArray(page.Input.Options)) {
          diagnostics.push(diagnostic('error', 'SCHEMA_PAGE_OPTIONS', `${pagePath}.Input.Options`, 'Input.Options must be an array.', 'Use the documented option grammar.'));
        } else {
          pushDuplicateDiagnostics(diagnostics, page.Input.Options, 'Index', `${pagePath}.Input.Options`, 'SCHEMA_DUPLICATE_OPTION_INDEX');
          const selectedCount = page.Input.Options.filter((option) => option?.Selected === true).length;
          if (page.Input.Options.length > 0 && selectedCount !== 1) {
            diagnostics.push(diagnostic('error', 'SCHEMA_PAGE_DEFAULT', `${pagePath}.Input.Options`, 'Exactly one option must be selected.', 'Set Selected true on the confirmed default only.'));
          }
          page.Input.Options.forEach((option, optionIndex) => {
            const optionPath = `${pagePath}.Input.Options[${optionIndex}]`;
            if (option?.Type === 'Button') {
              pushRequired(diagnostics, option, ['Index', 'Caption', 'Selected', 'Type', 'Values'], optionPath);
              if (!Array.isArray(option.Values) || option.Values.length === 0) diagnostics.push(diagnostic('error', 'SCHEMA_BUTTON_VALUES', `${optionPath}.Values`, 'Button option requires nonempty Values.', 'Add the confirmed FILTER/SUM value rows.'));
            }
            const dimensionMatch = typeof option?.Type === 'string' ? option.Type.match(/^Dimension\[([^\]]+)\]$/) : null;
            if (dimensionMatch) {
              if (!CONTROL_DIMENSIONS.includes(dimensionMatch[1])) diagnostics.push(diagnostic('error', 'SCHEMA_PAGE_DIMENSION', `${optionPath}.Type`, 'Page Dimension option is not canonical.', 'Use a confirmed canonical dimension.'));
              if (Object.hasOwn(option, 'Values')) diagnostics.push(diagnostic('error', 'SCHEMA_DIMENSION_VALUES', `${optionPath}.Values`, 'Dimension options must not carry Button Values.', 'Use the documented Dimension option bounds/default fields.'));
              for (const bound of ['Minimum', 'Maximum']) if (!Number.isInteger(option?.[bound]) || option[bound] < 0) diagnostics.push(diagnostic('error', 'SCHEMA_DIMENSION_BOUNDS', `${optionPath}.${bound}`, `Dimension option requires a nonnegative integer ${bound}.`, 'Set confirmed selection bounds explicitly.'));
            }
            if (option?.Type === 'DateRange') {
              pushRequired(diagnostics, option, ['Index', 'Caption', 'Selected', 'Type', 'IncludeOptions', 'Values'], optionPath);
              if (!Array.isArray(option.IncludeOptions) || option.IncludeOptions.length === 0) {
                diagnostics.push(diagnostic('error', 'SCHEMA_DATERANGE_OPTIONS', `${optionPath}.IncludeOptions`, 'DateRange requires nonempty IncludeOptions.', 'Use the exact approved Page Input DateRange shape.'));
              }
              if (!Array.isArray(option.Values) || option.Values.length === 0) {
                diagnostics.push(diagnostic('error', 'SCHEMA_DATERANGE_VALUES', `${optionPath}.Values`, 'DateRange requires a selected FILTER value.', 'Supply the confirmed Attribute, StartDate, and EndDate.'));
              } else {
                option.Values.forEach((value, valueIndex) => pushRequired(diagnostics, value, ['Type', 'Attribute', 'StartDate', 'EndDate'], `${optionPath}.Values[${valueIndex}]`));
                if (option.Values.some((value) => value?.Type !== 'FILTER')) {
                  diagnostics.push(diagnostic('error', 'SCHEMA_DATERANGE_FILTER', `${optionPath}.Values`, 'DateRange values must use Type FILTER.', 'Use the narrow approved exception without generalising it.'));
                }
              }
            }
            if (option?.Type && option.Type !== 'Button' && option.Type !== 'DateRange' && !dimensionMatch) diagnostics.push(diagnostic('error', 'SCHEMA_PAGE_OPTION_TYPE', `${optionPath}.Type`, 'Page option type is not builder-approved.', 'Use Button, a canonical Dimension option, or the exact DateRange exception.'));
          });
        }
      }
    }
    const optionalInputs = Array.isArray(page.OptionalInputs) ? page.OptionalInputs : [];
    for (const input of optionalInputs) if (input?.Key) inputKeys.push(input.Key);
    pushDuplicateDiagnostics(diagnostics, optionalInputs, 'Key', `${pagePath}.OptionalInputs`, 'SCHEMA_DUPLICATE_OPTIONAL_INPUT_KEY');
  });
  const duplicates = inputKeys.filter((key, index) => inputKeys.indexOf(key) !== index);
  for (const key of new Set(duplicates)) {
    diagnostics.push(diagnostic('error', 'SCHEMA_DUPLICATE_INPUT_KEY', 'Pages', `Duplicate input key ${key}.`, 'Use unique Page Input and OptionalInput keys.'));
  }
}

function validateDatasources(report, diagnostics) {
  pushDuplicateDiagnostics(diagnostics, report.Datasources, 'Key', 'Datasources', 'SCHEMA_DUPLICATE_DATASOURCE_KEY');
  pushDuplicateDiagnostics(diagnostics, report.Datasources, 'Index', 'Datasources', 'SCHEMA_DUPLICATE_DATASOURCE_INDEX');
  report.Datasources.forEach((datasource, index) => {
    const path = `Datasources[${index}]`;
    pushRequired(diagnostics, datasource, ['Index', 'Key', 'Output'], path);
    if (typeof datasource.Output !== 'boolean') diagnostics.push(diagnostic('error', 'SCHEMA_DATASOURCE_OUTPUT', `${path}.Output`, 'Output must be boolean.', 'Use true or false explicitly.'));
    const selections = Array.isArray(datasource.Selections) ? datasource.Selections : [];
    selections.forEach((selection, selectionIndex) => {
      if (!CONTROL_DIMENSIONS.includes(selection?.Dimension)) {
        diagnostics.push(diagnostic('error', 'SCHEMA_DIMENSION', `${path}.Selections[${selectionIndex}].Dimension`, 'Datasource selection uses a noncanonical dimension.', 'Use a confirmed canonical dimension.'));
      }
      if (selection?.Dimension === 'Measure') {
        for (const [rowIndex, row] of (selection.Selections || []).entries()) {
          if (!row?.Tag) diagnostics.push(diagnostic('error', 'SCHEMA_MEASURE_TAG', `${path}.Selections[${selectionIndex}].Selections[${rowIndex}].Tag`, 'Measure selection requires a supplied tag.', 'Supply the exact measure tag; never guess it.'));
        }
      }
    });
    if (datasource.Type === 'Import') {
      const fields = datasource?.Import?.Fields;
      if (!Array.isArray(fields) || fields.length === 0) {
        diagnostics.push(diagnostic('error', 'SCHEMA_IMPORT_FIELDS', `${path}.Import.Fields`, 'CSV Import requires a nonempty supplied field schema.', 'Obtain the file order, names, roles/types, and tags/dimensions from the user.'));
      } else {
        pushDuplicateDiagnostics(diagnostics, fields, 'Index', `${path}.Import.Fields`, 'SCHEMA_DUPLICATE_IMPORT_INDEX');
        fields.forEach((field, fieldIndex) => pushRequired(diagnostics, field, ['Index', 'Name', 'Type'], `${path}.Import.Fields[${fieldIndex}]`));
        diagnostics.push(diagnostic('warning', 'SCHEMA_IMPORT_WORKFLOW_CONFIRM', path, 'Import schema is present; workflow confirmation is not machine-provable.', 'Retain the user-confirmed import workflow in the report contract.'));
      }
    }
  });
}

function validateToolbars(report, diagnostics) {
  const toolbars = getToolbars(report);
  pushDuplicateDiagnostics(diagnostics, toolbars, 'Key', 'Views.Toolbar', 'SCHEMA_DUPLICATE_TOOLBAR_KEY');
  toolbars.forEach((toolbar, index) => {
    const path = `Views.Toolbar[${index}]`;
    pushRequired(diagnostics, toolbar, ['Key', 'Caption', 'Datasource', 'Dimension', 'MinimumSelections', 'MaximumSelections', 'MultipleSelection', 'OnChangeSyncPanels'], path);
    if (!CONTROL_DIMENSIONS.includes(toolbar?.Dimension)) diagnostics.push(diagnostic('error', 'SCHEMA_TOOLBAR_DIMENSION', `${path}.Dimension`, 'Toolbar dimension is not canonical.', 'Use Product, Market, Date, Time, Promotion, Shopper, Basket, or Measure.'));
    if (toolbar?.MultipleSelection === false && (toolbar.MinimumSelections !== 1 || toolbar.MaximumSelections !== 1)) {
      diagnostics.push(diagnostic('error', 'SCHEMA_TOOLBAR_SINGLE_BOUNDS', path, 'Single-selection toolbar must have minimum and maximum of one.', 'Set both bounds to 1.'));
    }
    if (!Number.isInteger(toolbar?.MinimumSelections) || !Number.isInteger(toolbar?.MaximumSelections) || toolbar.MinimumSelections < 0 || toolbar.MinimumSelections > toolbar.MaximumSelections) {
      diagnostics.push(diagnostic('error', 'SCHEMA_TOOLBAR_BOUNDS', path, 'Toolbar selection bounds are invalid.', 'Use nonnegative integers with minimum not greater than maximum.'));
    }
  });
}

function validateWidget(panel, path, diagnostics) {
  const widgets = SUPPORTED_WIDGETS.filter((widget) => Object.hasOwn(panel, widget));
  if (widgets.length !== 1) diagnostics.push(diagnostic('error', 'SCHEMA_WIDGET_EXCLUSIVITY', path, `Panel has ${widgets.length} supported widget objects.`, 'Use exactly one supported widget per panel.'));
  if (panel.Textbox) {
    pushRequired(diagnostics, panel.Textbox, ['Content', 'TextColor', 'BackgroundColor', 'VerticalAlign', 'HorizontalAlign'], `${path}.Textbox`);
    if (!['top', 'middle', 'bottom'].includes(panel.Textbox.VerticalAlign)) diagnostics.push(diagnostic('error', 'SCHEMA_TEXTBOX_VERTICAL_ALIGN', `${path}.Textbox.VerticalAlign`, 'Invalid vertical alignment.', 'Use top, middle, or bottom.'));
    if (!['left', 'center', 'right'].includes(panel.Textbox.HorizontalAlign)) diagnostics.push(diagnostic('error', 'SCHEMA_TEXTBOX_HORIZONTAL_ALIGN', `${path}.Textbox.HorizontalAlign`, 'Invalid horizontal alignment.', 'Use left, center, or right.'));
  }
  if (panel.StandardChart) {
    if (!panel.Datasource) diagnostics.push(diagnostic('error', 'SCHEMA_WIDGET_DATASOURCE', `${path}.Datasource`, 'StandardChart requires a datasource.', 'Supply a resolving datasource key.'));
    const axes = panel.StandardChart.Axes;
    if (!Array.isArray(axes) || axes.length === 0) diagnostics.push(diagnostic('error', 'SCHEMA_CHART_AXES', `${path}.StandardChart.Axes`, 'StandardChart requires nonempty Axes.', 'Add the confirmed category and value axes.'));
    for (const [axisIndex, axis] of (axes || []).entries()) {
      pushRequired(diagnostics, axis, ['Location', 'Series'], `${path}.StandardChart.Axes[${axisIndex}]`);
      if (['Bottom', 'bottom', 'Top', 'top'].includes(axis?.Location) && !requireObject(axis.LabelAngel)) {
        diagnostics.push(diagnostic('error', 'SCHEMA_CHART_LABEL_ANGEL', `${path}.StandardChart.Axes[${axisIndex}].LabelAngel`, 'Category axis requires the intentional LabelAngel object.', 'Supply Angel and MinimumDataPoint; do not use LabelAngle.'));
      }
      if (axis?.Series && !['horizontalbar', 'verticalbar', 'verticalstackbar', 'line', 'area'].includes(axis.Series.Type)) {
        diagnostics.push(diagnostic('error', 'SCHEMA_CHART_SERIES_TYPE', `${path}.StandardChart.Axes[${axisIndex}].Series.Type`, 'Series type is not builder-approved.', 'Use a proven native series type or supply reviewed evidence.'));
      }
    }
  }
  if (panel.Table) {
    if (!panel.Datasource) diagnostics.push(diagnostic('error', 'SCHEMA_WIDGET_DATASOURCE', `${path}.Datasource`, 'Table requires a datasource.', 'Supply a resolving datasource key.'));
    if (!Array.isArray(panel.Table.Columns) || panel.Table.Columns.length === 0) diagnostics.push(diagnostic('error', 'SCHEMA_TABLE_COLUMNS', `${path}.Table.Columns`, 'Table requires nonempty Columns.', 'Add confirmed dimension and measure columns.'));
  }
  if (panel.TableV2) {
    if (!panel.Datasource) diagnostics.push(diagnostic('error', 'SCHEMA_WIDGET_DATASOURCE', `${path}.Datasource`, 'TableV2 requires a datasource.', 'Supply a resolving datasource key.'));
    if (!requireObject(panel.TableV2.Appearance)) diagnostics.push(diagnostic('error', 'SCHEMA_TABLEV2_APPEARANCE', `${path}.TableV2.Appearance`, 'TableV2 requires Appearance.', 'Use the full routed TableV2 appearance grammar.'));
    if (!Array.isArray(panel.TableV2.Columns) || panel.TableV2.Columns.length === 0) diagnostics.push(diagnostic('error', 'SCHEMA_TABLEV2_COLUMNS', `${path}.TableV2.Columns`, 'TableV2 requires nonempty Columns.', 'Add confirmed dimension and measure columns.'));
    for (const [columnIndex, column] of (panel.TableV2.Columns || []).entries()) {
      if (!CONTROL_DIMENSIONS.includes(column?.Dimension)) diagnostics.push(diagnostic('error', 'SCHEMA_TABLEV2_DIMENSION', `${path}.TableV2.Columns[${columnIndex}].Dimension`, 'TableV2 column dimension is not canonical.', 'Use a confirmed canonical dimension.'));
      if (column?.Dimension === 'Measure') {
        for (const [formatIndex, formatting] of (column.Formatting || []).entries()) {
          const formatPath = `${path}.TableV2.Columns[${columnIndex}].Formatting[${formatIndex}]`;
          if (['Text', 'Number'].includes(formatting?.Type)) diagnostics.push(diagnostic('error', 'SCHEMA_TABLEV2_FORMAT_DENIED', `${formatPath}.Type`, `${formatting.Type} is denied for TableV2 measure cells.`, 'Use Bar, Circle, or Status; Caption only in its documented context.'));
          if (!['Bar', 'Circle', 'Status', 'Caption'].includes(formatting?.Type)) diagnostics.push(diagnostic('error', 'SCHEMA_TABLEV2_FORMAT_UNKNOWN', `${formatPath}.Type`, 'Formatting type is not builder-approved.', 'Use the routed TableV2 formatting allowlist.'));
          if (Object.hasOwn(formatting || {}, 'ForegroundColour')) diagnostics.push(diagnostic('error', 'SCHEMA_FOREGROUND_SPELLING', `${formatPath}.ForegroundColour`, 'ForegroundColour is not the intentional VI key.', 'Use ForgroundColour exactly where documented.'));
        }
      }
    }
  }
  if (panel.AdvanceTable) {
    if (!panel.Datasource) diagnostics.push(diagnostic('error', 'SCHEMA_WIDGET_DATASOURCE', `${path}.Datasource`, 'AdvanceTable requires a datasource.', 'Supply a resolving datasource key.'));
    pushRequired(diagnostics, panel.AdvanceTable, ['Appearance', 'Dimensions', 'ClientSideProcessing', 'ShowAttribute'], `${path}.AdvanceTable`);
    if (!Array.isArray(panel.AdvanceTable.Dimensions) || panel.AdvanceTable.Dimensions.length === 0) diagnostics.push(diagnostic('error', 'SCHEMA_ADVANCE_DIMENSIONS', `${path}.AdvanceTable.Dimensions`, 'AdvanceTable requires nonempty Dimensions.', 'Add confirmed Row, Column, or Filter dimensions.'));
    for (const [dimensionIndex, dimension] of (panel.AdvanceTable.Dimensions || []).entries()) {
      if (!CONTROL_DIMENSIONS.includes(dimension?.Dimension)) diagnostics.push(diagnostic('error', 'SCHEMA_ADVANCE_DIMENSION', `${path}.AdvanceTable.Dimensions[${dimensionIndex}].Dimension`, 'AdvanceTable dimension is not canonical.', 'Use a confirmed canonical dimension.'));
      if (!['Row', 'Column', 'Filter'].includes(dimension?.Location)) diagnostics.push(diagnostic('error', 'SCHEMA_ADVANCE_LOCATION', `${path}.AdvanceTable.Dimensions[${dimensionIndex}].Location`, 'AdvanceTable location is invalid.', 'Use Row, Column, or Filter.'));
    }
  }
}

function validateViews(report, diagnostics) {
  const views = getViews(report);
  pushDuplicateDiagnostics(diagnostics, views, 'Key', 'Views.Views', 'SCHEMA_DUPLICATE_VIEW_KEY');
  pushDuplicateDiagnostics(diagnostics, views, 'Index', 'Views.Views', 'SCHEMA_DUPLICATE_VIEW_INDEX');
  const allPanels = getPanels(report).map(({ panel }) => panel);
  pushDuplicateDiagnostics(diagnostics, allPanels, 'Key', 'Views.Views[].Dashboard.Panels', 'SCHEMA_DUPLICATE_PANEL_KEY');
  views.forEach((view, viewIndex) => {
    const viewPath = `Views.Views[${viewIndex}]`;
    pushRequired(diagnostics, view, ['Index', 'Key', 'Title', 'ToolTip', 'Thumbnail', 'Dashboard'], viewPath);
    const dashboard = view.Dashboard;
    if (!requireObject(dashboard)) {
      diagnostics.push(diagnostic('error', 'SCHEMA_DASHBOARD_OBJECT', `${viewPath}.Dashboard`, 'View Dashboard must be an object.', 'Use the canonical Dashboard shape.'));
      return;
    }
    pushRequired(diagnostics, dashboard, ['Columns', 'CellSpacing', 'ShowGridLines', 'AllowFloating', 'AllowDragging', 'AllowResizing', 'Panels'], `${viewPath}.Dashboard`);
    if (!Number.isInteger(dashboard.Columns) || dashboard.Columns <= 0) diagnostics.push(diagnostic('error', 'SCHEMA_DASHBOARD_COLUMNS', `${viewPath}.Dashboard.Columns`, 'Dashboard Columns must be a positive integer.', 'Use the confirmed grid width.'));
    const panels = Array.isArray(dashboard.Panels) ? dashboard.Panels : [];
    panels.forEach((panel, panelIndex) => {
      const path = `${viewPath}.Dashboard.Panels[${panelIndex}]`;
      pushRequired(diagnostics, panel, ['Key', 'Row', 'Col', 'SizeX', 'SizeY'], path);
      const validGeometry = Number.isInteger(panel.Row) && panel.Row >= 0 && Number.isInteger(panel.Col) && panel.Col >= 0 && Number.isInteger(panel.SizeX) && panel.SizeX > 0 && Number.isInteger(panel.SizeY) && panel.SizeY > 0;
      if (!validGeometry) diagnostics.push(diagnostic('error', 'SCHEMA_PANEL_GEOMETRY', path, 'Panel geometry must use nonnegative Row/Col and positive integer SizeX/SizeY.', 'Correct the grid geometry.'));
      if (validGeometry && Number.isInteger(dashboard.Columns) && panel.Col + panel.SizeX > dashboard.Columns) diagnostics.push(diagnostic('error', 'SCHEMA_PANEL_OUT_OF_BOUNDS', path, 'Panel exceeds Dashboard.Columns.', 'Reduce Col/SizeX or increase the confirmed grid width.'));
      validateWidget(panel, path, diagnostics);
    });
    for (let left = 0; left < panels.length; left += 1) {
      for (let right = left + 1; right < panels.length; right += 1) {
        const a = panels[left];
        const b = panels[right];
        if (![a, b].every((panel) => Number.isInteger(panel.Row) && Number.isInteger(panel.Col) && Number.isInteger(panel.SizeX) && Number.isInteger(panel.SizeY))) continue;
        const overlaps = a.Col < b.Col + b.SizeX && a.Col + a.SizeX > b.Col && a.Row < b.Row + b.SizeY && a.Row + a.SizeY > b.Row;
        if (overlaps) diagnostics.push(diagnostic('error', 'SCHEMA_PANEL_OVERLAP', `${viewPath}.Dashboard.Panels`, `Panels ${a.Key || left} and ${b.Key || right} overlap.`, 'Reflow the grid or record an accepted overlay pattern.'));
      }
    }
  });
}

function validateRequiredControls(report, options, diagnostics) {
  const panels = new Map(getPanels(report).map(({ panel, path }) => [String(panel?.Key), { panel, path }]));
  const requirements = [
    ['require-wider-panel', 'Wider'],
    ['require-fullscreen-panel', 'Fullscreen']
  ];
  for (const [option, label] of requirements) {
    for (const panelKey of optionList(options, option).map(String)) {
      const entry = panels.get(panelKey);
      if (!entry) {
        diagnostics.push(diagnostic('error', 'SCHEMA_REQUIRED_CONTROL_PANEL', 'Views.Views[].Dashboard.Panels', `${label} requirement names unknown panel ${panelKey}.`, 'Correct the report contract or panel key.'));
        continue;
      }
      const content = entry.panel?.Textbox?.Content;
      const named = typeof content === 'string' && new RegExp(`(?:aria-label|title|>)[^<]{0,80}${label}`, 'i').test(content);
      if (!named) diagnostics.push(diagnostic('error', `SCHEMA_${label.toUpperCase()}_CONTROL`, entry.path, `${label} is required by the report contract but no visibly/ARIA-named control was found.`, `Add the proven ${label} control pattern and its manual keyboard/browser test.`));
    }
  }
}

export async function validateReportSchema(candidatePath, options = {}) {
  const mode = String(options.mode || '');
  if (!['new', 'modify'].includes(mode)) throw new Error('--mode must be new or modify.');
  if (mode === 'modify' && !options.source) throw new Error('--source is required in modify mode.');
  let document;
  try {
    document = await readJsonDocument(candidatePath);
  } catch (error) {
    if (error.code !== 'INVALID_JSON') throw error;
    const absolutePath = resolve(candidatePath);
    const text = await readFile(absolutePath, 'utf8');
    const diagnostics = [diagnostic('error', 'SCHEMA_JSON_PARSE', '$', error.message, 'Remove comments/trailing content and correct the JSON syntax before any other validation.')];
    return {
      schemaVersion: 1,
      kind: 'legacy-vi-schema-validation',
      completedAt: new Date().toISOString(),
      candidateFile: absolutePath,
      candidateSha256: sha256(text),
      mode,
      sourceFile: options.source ? resolve(String(options.source)) : null,
      parsed: false,
      diagnostics,
      counts: countDiagnostics(diagnostics),
      passed: false
    };
  }
  const sourceDocument = options.source ? await readJsonDocument(String(options.source)) : null;
  const diagnostics = [];
  for (const path of document.duplicateKeys) diagnostics.push(diagnostic('error', 'SCHEMA_DUPLICATE_JSON_KEY', path, 'JSON object contains a duplicate key.', 'Remove the duplicate and retain one intentional value.'));
  if (!requireObject(document.value)) {
    diagnostics.push(diagnostic('error', 'SCHEMA_ROOT_OBJECT', '$', 'Report root must be an object.', 'Use the documented legacy root grammar.'));
  } else {
    pushRequired(diagnostics, document.value, ['General', 'Pages', 'Datasources', 'Views'], '$');
    if (!requireObject(document.value.General)) diagnostics.push(diagnostic('error', 'SCHEMA_GENERAL_OBJECT', 'General', 'General must be an object.', 'Use the routed root grammar.'));
    if (!Array.isArray(document.value.Pages)) diagnostics.push(diagnostic('error', 'SCHEMA_PAGES_ARRAY', 'Pages', 'Pages must be an array.', 'Use an array even when empty.'));
    if (!Array.isArray(document.value.Datasources)) diagnostics.push(diagnostic('error', 'SCHEMA_DATASOURCES_ARRAY', 'Datasources', 'Datasources must be an array.', 'Use an array even when empty.'));
    if (!requireObject(document.value.Views)) diagnostics.push(diagnostic('error', 'SCHEMA_VIEWS_OBJECT', 'Views', 'Views must be an object.', 'Use Views.Toolbar[] and Views.Views[].'));
    if (requireObject(document.value.Views)) {
      if (!Array.isArray(document.value.Views.Toolbar)) diagnostics.push(diagnostic('error', 'SCHEMA_TOOLBAR_ARRAY', 'Views.Toolbar', 'Views.Toolbar must be an array.', 'Use an array even when empty.'));
      if (!Array.isArray(document.value.Views.Views)) diagnostics.push(diagnostic('error', 'SCHEMA_VIEW_ARRAY', 'Views.Views', 'Views.Views must be an array.', 'Use the canonical view list.'));
    }
    validateAllowlist(document, sourceDocument, mode, diagnostics);
    if (Array.isArray(document.value.Pages)) validatePages(document.value, diagnostics);
    if (Array.isArray(document.value.Datasources)) validateDatasources(document.value, diagnostics);
    if (Array.isArray(document.value?.Views?.Toolbar)) validateToolbars(document.value, diagnostics);
    if (Array.isArray(document.value?.Views?.Views)) validateViews(document.value, diagnostics);
    validateRequiredControls(document.value, options, diagnostics);
    validateRuleScopes(document.value, diagnostics);
  }
  const counts = countDiagnostics(diagnostics);
  return {
    schemaVersion: 1,
    kind: 'legacy-vi-schema-validation',
    completedAt: new Date().toISOString(),
    candidateFile: document.absolutePath,
    candidateSha256: document.sha256,
    mode,
    sourceFile: sourceDocument?.absolutePath || null,
    parsed: true,
    diagnostics,
    counts,
    passed: counts.error === 0
  };
}

if (isMain(import.meta.url)) {
  const { positional, options } = parseCli(process.argv.slice(2));
  if (positional.length !== 1) {
    process.stderr.write('Usage: node validate-report-schema.mjs <candidate.json> --mode <new|modify> [--source <source.json>] [--out-dir <directory>]\n');
    process.exit(2);
  }
  try {
    const result = await validateReportSchema(positional[0], options);
    const output = await writeResultPair(result, { outDir: options['out-dir'] || '.', baseName: `${candidateBaseName(positional[0])}.schema`, title: 'Legacy VI schema validation' });
    process.stdout.write(`${result.passed ? 'PASS' : 'FAIL'} schema ${output.jsonPath}\n`);
    if (!result.passed) process.exitCode = 1;
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }
}
