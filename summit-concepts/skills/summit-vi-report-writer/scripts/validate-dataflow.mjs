#!/usr/bin/env node

import process from 'node:process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  CONTROL_DIMENSIONS,
  candidateBaseName,
  countDiagnostics,
  diagnostic,
  duplicateValues,
  extractTokens,
  getPanels,
  getToolbars,
  getViews,
  isMain,
  parseCli,
  readJsonDocument,
  walkStrings,
  writeResultPair
} from './validation-core.mjs';

function dependencyKey(value) {
  if (typeof value === 'string') return value;
  return value?.Datasource || value?.Key || value?.Name || null;
}

function datasourceModel(report) {
  return new Map(
    (report.Datasources || []).filter((datasource) => datasource?.Key).map((datasource) => {
      const dimensions = new Set();
      const tags = new Set();
      for (const selection of datasource.Selections || []) {
        if (selection?.Dimension) dimensions.add(selection.Dimension);
        for (const row of selection?.Selections || []) if (row?.Tag) tags.add(row.Tag);
      }
      for (const field of datasource?.Import?.Fields || []) {
        if (field?.Dimension) dimensions.add(field.Dimension);
        if (field?.Tag) tags.add(field.Tag);
      }
      const dependencies = (datasource?.Scripts?.Dependencies || []).map(dependencyKey).filter(Boolean);
      return [datasource.Key, { datasource, dimensions, tags, dependencies }];
    })
  );
}

function findCycles(model) {
  const visiting = new Set();
  const visited = new Set();
  const cycles = [];
  function visit(key, stack) {
    if (visiting.has(key)) {
      const start = stack.indexOf(key);
      cycles.push([...stack.slice(start), key]);
      return;
    }
    if (visited.has(key) || !model.has(key)) return;
    visiting.add(key);
    for (const dependency of model.get(key).dependencies) visit(dependency, [...stack, key]);
    visiting.delete(key);
    visited.add(key);
  }
  for (const key of model.keys()) visit(key, []);
  return cycles;
}

function extractInputKeys(report) {
  const keys = new Set();
  for (const page of report.Pages || []) {
    if (page?.Input?.Key) keys.add(page.Input.Key);
    for (const input of page?.OptionalInputs || []) if (input?.Key) keys.add(input.Key);
  }
  return keys;
}

function checkExpressionReferences(report, datasourceKeys, inputKeys, diagnostics) {
  walkStrings(report, (text, path) => {
    for (const match of text.matchAll(/IQe\.Input\(@([^,\s)]+)/g)) {
      if (!inputKeys.has(match[1])) diagnostics.push(diagnostic('error', 'DATAFLOW_DANGLING_INPUT', path, `IQe.Input references unknown input ${match[1]}.`, 'Use an existing confirmed Page Input or OptionalInput key.'));
    }
    for (const match of text.matchAll(/IQe\.Datasource\((?:@)?([^,\s)]+)/g)) {
      if (!datasourceKeys.has(match[1])) diagnostics.push(diagnostic('error', 'DATAFLOW_DANGLING_IQE_DATASOURCE', path, `IQe.Datasource references unknown datasource ${match[1]}.`, 'Add the confirmed dependency/datasource or correct the expression.'));
    }
  });
}

function validateTokens(report, model, toolbarByDatasourceDimension, diagnostics) {
  for (const { panel, path } of getPanels(report)) {
    const strings = [];
    walkStrings(panel, (text, stringPath) => strings.push({ text, stringPath }), path);
    for (const { text, stringPath } of strings) {
      for (const token of extractTokens(text)) {
        if (!['LabelOfSelected', 'DataOfSelected', 'LabelOfAll', 'LabelOfTag'].includes(token.name)) continue;
        const datasourceKey = token.parameters.Datasource || panel.Datasource;
        if (!datasourceKey || !model.has(datasourceKey)) {
          diagnostics.push(diagnostic('error', 'DATAFLOW_TOKEN_DATASOURCE', stringPath, `${token.name} has no resolving datasource context.`, 'Name the datasource in Textbox tokens or use the panel datasource for native charts.'));
          continue;
        }
        const datasource = model.get(datasourceKey);
        const dimension = token.parameters.Dimension;
        if (dimension && !datasource.dimensions.has(dimension)) diagnostics.push(diagnostic('error', 'DATAFLOW_TOKEN_DIMENSION', stringPath, `Token dimension ${dimension} is absent from ${datasourceKey}.`, 'Use a confirmed datasource dimension.'));
        const tag = token.parameters.MeasureIndexOrTag || token.parameters.MeasureIndexOrTagList;
        if (tag && !/^\d+$/.test(tag) && !datasource.tags.has(tag)) diagnostics.push(diagnostic('error', 'DATAFLOW_TOKEN_MEASURE', stringPath, `Token measure tag ${tag} is absent from ${datasourceKey}.`, 'Use an exact supplied measure tag.'));
        if (token.name.endsWith('Selected') && dimension) {
          const route = `${datasourceKey}\u0000${dimension}`;
          const syncingPanels = toolbarByDatasourceDimension.get(route) || new Set();
          if (!syncingPanels.has(panel.Key)) diagnostics.push(diagnostic('error', 'DATAFLOW_TOKEN_TOOLBAR_STATE', stringPath, `Selected-state token has no matching ${datasourceKey}/${dimension} toolbar synced to panel ${panel.Key}.`, 'Add the panel to the matching toolbar OnChangeSyncPanels list.'));
        }
      }
    }
  }
}

function collectConnectionShape(panel) {
  if (Object.hasOwn(panel || {}, 'DataConnections')) return 'DataConnections';
  if (Object.hasOwn(panel || {}, 'ConnectedToolbars')) return 'ConnectedToolbars';
  return 'OnChangeSyncPanels';
}

function duplicateArrayValues(values) {
  if (!Array.isArray(values)) return [];
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    const key = typeof value === 'string' ? value : JSON.stringify(value);
    if (seen.has(key)) duplicates.add(key);
    seen.add(key);
  }
  return [...duplicates].sort();
}

function panelDataProfile(panel) {
  const widgets = ['StandardChart', 'Table', 'TableV2', 'AdvanceTable'].filter((widget) => panel?.[widget]);
  const textboxHasData = typeof panel?.Textbox?.Content === 'string' && extractTokens(panel.Textbox.Content).some((token) => ['LabelOfSelected', 'DataOfSelected', 'LabelOfAll', 'LabelOfTag'].includes(token.name));
  return { widgets, textboxHasData, dataBearing: widgets.length > 0 || textboxHasData };
}

async function loadClientMeasurePack(clientPackDir) {
  if (!clientPackDir) return null;
  const dir = resolve(String(clientPackDir));
  const packPath = resolve(dir, 'measures.json');
  const pack = JSON.parse(await readFile(packPath, 'utf8'));
  const key = String(pack?.clientKey ?? '');
  if (!key || !Array.isArray(pack?.measures)) throw new Error('The client measure pack at --client-pack-dir is missing or malformed (needs clientKey and measures[]).');
  return { key, measures: new Map(pack.measures.map((measure) => [measure.tag, measure])) };
}

function validateClientMeasureTags(report, clientPack, diagnostics) {
  if (!clientPack) return { checkedTags: [], cautionTags: [] };
  const checkedTags = new Set();
  const cautionTags = new Set();
  for (const [datasourceIndex, datasource] of (report.Datasources || []).entries()) {
    for (const [selectionIndex, selection] of (datasource.Selections || []).entries()) {
      if (selection?.Dimension !== 'Measure') continue;
      for (const [rowIndex, row] of (selection.Selections || []).entries()) {
        const path = `Datasources[${datasourceIndex}].Selections[${selectionIndex}].Selections[${rowIndex}].Tag`;
        if (typeof row?.Tag !== 'string' || !row.Tag.trim()) {
          diagnostics.push(diagnostic('error', 'DATAFLOW_CLIENT_MEASURE_TAG_REQUIRED', path, 'A client-pack Measure selection requires an exact non-empty tag.', 'Resolve the writer phrase through the selected client measure guide and record the confirmed exact tag.'));
          continue;
        }
        checkedTags.add(row.Tag);
        const measure = clientPack.measures.get(row.Tag);
        if (!measure) {
          diagnostics.push(diagnostic('error', 'DATAFLOW_CLIENT_MEASURE_UNKNOWN', path, `Measure tag ${row.Tag} is not in the selected client measure pack.`, 'Do not guess. Ask for a supplied measure export or choose a writer-confirmed tag from the client pack.'));
          continue;
        }
        if (measure.evidence?.status !== 'corpus-proven' && !cautionTags.has(row.Tag)) {
          cautionTags.add(row.Tag);
          diagnostics.push(diagnostic('warning', 'DATAFLOW_CLIENT_MEASURE_CAUTION', path, `Measure tag ${row.Tag} is ${measure.evidence?.status || 'not corpus-proven'}.`, 'Show the evidence caution to the writer and verify the measure and datasource in UAT2.'));
        }
        if (measure.aggregation?.requiresUserInput) {
          const resolvedExpression = typeof row.Expression === 'string' && row.Expression.trim() && !/\$\?|\?/.test(row.Expression);
          if (!resolvedExpression) diagnostics.push(diagnostic('error', 'DATAFLOW_CLIENT_MEASURE_INPUT_REQUIRED', path, `Measure tag ${row.Tag} requires a resolved dictionary user-input expression.`, 'Supply and confirm the required input, substitute it into a proven Expression, and remove all unresolved placeholders.'));
        }
      }
    }
  }
  walkStrings(report, (text, path) => {
    for (const token of extractTokens(text)) {
      const tag = token.parameters.MeasureIndexOrTag || token.parameters.MeasureIndexOrTagList;
      if (!tag) continue;
      if (/^\d+$/.test(tag)) diagnostics.push(diagnostic('error', 'DATAFLOW_CLIENT_MEASURE_NUMERIC_INDEX', path, `Client-pack validation requires an exact tag, not numeric measure index ${tag}.`, 'Resolve and confirm the exact tag through the measure guide.'));
      else if (!clientPack.measures.has(tag)) diagnostics.push(diagnostic('error', 'DATAFLOW_CLIENT_MEASURE_UNKNOWN', path, `Token measure tag ${tag} is not in the selected client measure pack.`, 'Use the same confirmed exact tag as the datasource Measure selection.'));
    }
  });
  return { checkedTags: [...checkedTags].sort(), cautionTags: [...cautionTags].sort() };
}

export async function validateDataflow(candidatePath, options = {}) {
  const mode = String(options.mode || '');
  if (!['new', 'modify'].includes(mode)) throw new Error('--mode must be new or modify.');
  if (mode === 'modify' && !options.source) throw new Error('--source is required in modify mode.');
  const document = await readJsonDocument(candidatePath);
  const source = options.source ? await readJsonDocument(String(options.source)) : null;
  const report = document.value;
  const diagnostics = [];
  const clientPack = await loadClientMeasurePack(options['client-pack-dir']);
  const model = datasourceModel(report);
  const datasourceKeys = new Set(model.keys());
  const views = getViews(report);
  const viewKeys = new Set(views.map((view) => view?.Key).filter(Boolean));
  const panelEntries = getPanels(report);
  const panelKeys = new Set(panelEntries.map(({ panel }) => panel?.Key).filter(Boolean));
  const toolbars = getToolbars(report);
  const toolbarKeys = new Set(toolbars.map((toolbar) => toolbar?.Key).filter(Boolean));
  const inputKeys = extractInputKeys(report);
  const toolbarByDatasourceDimension = new Map();
  const panelViewKeys = new Map();
  const syncingToolbarKeysByPanel = new Map([...panelKeys].map((key) => [key, new Set()]));
  for (const view of views) {
    for (const panel of view?.Dashboard?.Panels || []) if (panel?.Key) panelViewKeys.set(panel.Key, view?.Key || null);
  }

  for (const duplicate of duplicateValues(report.Datasources || [], 'Key')) diagnostics.push(diagnostic('error', 'DATAFLOW_DUPLICATE_DATASOURCE', 'Datasources', `Datasource key ${duplicate} is duplicated.`, 'Use unique keys before resolving references.'));
  for (const duplicate of duplicateValues(panelEntries.map(({ panel }) => panel), 'Key')) diagnostics.push(diagnostic('error', 'DATAFLOW_DUPLICATE_PANEL', 'Views.Views[].Dashboard.Panels', `Panel key ${duplicate} is duplicated.`, 'Use globally unique panel keys.'));

  for (const [key, entry] of model) {
    for (const dependency of entry.dependencies) {
      if (!model.has(dependency)) diagnostics.push(diagnostic('error', 'DATAFLOW_DANGLING_DEPENDENCY', `Datasources.${key}.Scripts.Dependencies`, `Dependency ${dependency} does not resolve.`, 'Use an existing datasource key and keep dependencies acyclic.'));
    }
  }
  for (const cycle of findCycles(model)) diagnostics.push(diagnostic('error', 'DATAFLOW_DEPENDENCY_CYCLE', 'Datasources', `Datasource dependency cycle: ${cycle.join(' -> ')}.`, 'Remove the cycle and build in topological order.'));

  for (const [index, toolbar] of toolbars.entries()) {
    const path = `Views.Toolbar[${index}]`;
    if (!datasourceKeys.has(toolbar?.Datasource)) diagnostics.push(diagnostic('error', 'DATAFLOW_TOOLBAR_DATASOURCE', `${path}.Datasource`, `Toolbar datasource ${toolbar?.Datasource ?? '<missing>'} does not resolve.`, 'Use a confirmed Datasources[].Key.'));
    const ds = model.get(toolbar?.Datasource);
    if (ds && toolbar?.Dimension && !ds.dimensions.has(toolbar.Dimension)) diagnostics.push(diagnostic('error', 'DATAFLOW_TOOLBAR_DIMENSION', `${path}.Dimension`, `Toolbar dimension ${toolbar.Dimension} is absent from ${toolbar.Datasource}.`, 'Add the confirmed datasource selection or correct the toolbar.'));
    const syncPanels = Array.isArray(toolbar?.OnChangeSyncPanels) ? toolbar.OnChangeSyncPanels : [];
    const hiddenForViews = Array.isArray(toolbar?.HiddenForViews) ? toolbar.HiddenForViews : [];
    const invalidatedDatasources = Array.isArray(toolbar?.OnChangeDisablePool) ? toolbar.OnChangeDisablePool : [];
    if (!Array.isArray(toolbar?.OnChangeSyncPanels)) diagnostics.push(diagnostic('error', 'DATAFLOW_SYNC_ARRAY', `${path}.OnChangeSyncPanels`, 'OnChangeSyncPanels must be an array.', 'Use the approved new-work connection form.'));
    for (const duplicate of duplicateArrayValues(syncPanels)) diagnostics.push(diagnostic('error', 'DATAFLOW_DUPLICATE_SYNC_PANEL', `${path}.OnChangeSyncPanels`, `Panel refresh target ${duplicate} is repeated.`, 'List each intended panel key once.'));
    for (const duplicate of duplicateArrayValues(hiddenForViews)) diagnostics.push(diagnostic('error', 'DATAFLOW_DUPLICATE_HIDDEN_VIEW', `${path}.HiddenForViews`, `Hidden view ${duplicate} is repeated.`, 'List each intended view key once.'));
    for (const duplicate of duplicateArrayValues(invalidatedDatasources)) diagnostics.push(diagnostic('error', 'DATAFLOW_DUPLICATE_INVALIDATION_DATASOURCE', `${path}.OnChangeDisablePool`, `Invalidation target ${duplicate} is repeated.`, 'List each intended datasource key once.'));
    if (mode === 'new' && syncPanels.length === 0 && invalidatedDatasources.length === 0) diagnostics.push(diagnostic('warning', 'DATAFLOW_TOOLBAR_NO_EFFECT', path, `Toolbar ${toolbar?.Key ?? '<missing>'} has no panel refresh or pool invalidation target.`, 'Remove it or record and manually test the supplied runtime reason.'));
    for (const panelKey of syncPanels) {
      if (!panelKeys.has(panelKey)) diagnostics.push(diagnostic('error', 'DATAFLOW_STALE_PANEL_REF', `${path}.OnChangeSyncPanels`, `Panel ${panelKey} does not resolve.`, 'Remove the stale key or use an existing panel key.'));
      else syncingToolbarKeysByPanel.get(panelKey)?.add(toolbar?.Key);
    }
    for (const viewKey of hiddenForViews) if (!viewKeys.has(viewKey)) diagnostics.push(diagnostic('error', 'DATAFLOW_HIDDEN_VIEW_REF', `${path}.HiddenForViews`, `View ${viewKey} does not resolve.`, 'Use an existing view key.'));
    for (const datasourceKey of invalidatedDatasources) {
      if (!datasourceKeys.has(datasourceKey)) {
        diagnostics.push(diagnostic('error', 'DATAFLOW_INVALIDATION_REF', `${path}.OnChangeDisablePool`, `${datasourceKey} is not a datasource key.`, 'Invalidation lists contain datasource keys, not pool names.'));
      } else if (!model.get(datasourceKey)?.datasource?.Pool?.Key) {
        diagnostics.push(diagnostic('error', 'DATAFLOW_INVALIDATION_POOL', `${path}.OnChangeDisablePool`, `${datasourceKey} is invalidated but has no Pool.Key.`, 'Add the confirmed datasource pool configuration or remove the invalidation target.'));
      }
    }
    const route = `${toolbar?.Datasource}\u0000${toolbar?.Dimension}`;
    if (!toolbarByDatasourceDimension.has(route)) toolbarByDatasourceDimension.set(route, new Set());
    for (const panelKey of syncPanels) toolbarByDatasourceDimension.get(route).add(panelKey);
  }

  const sourcePanels = new Map((source ? getPanels(source.value) : []).map(({ panel }) => [panel?.Key, panel]));
  const syncedPanelKeys = new Set(toolbars.flatMap((toolbar) => toolbar?.OnChangeSyncPanels || []));
  for (const { panel, path } of panelEntries) {
    const { widgets, dataBearing } = panelDataProfile(panel);
    if (panel?.Datasource && !datasourceKeys.has(panel.Datasource)) diagnostics.push(diagnostic('error', 'DATAFLOW_PANEL_DATASOURCE', `${path}.Datasource`, `Panel datasource ${panel.Datasource} does not resolve.`, 'Use a confirmed Datasources[].Key.'));
    if (widgets.length > 0 && !panel?.Datasource) diagnostics.push(diagnostic('error', 'DATAFLOW_PANEL_DATASOURCE_MISSING', `${path}.Datasource`, 'Native data-bearing panel has no datasource.', 'Supply a resolving datasource key.'));
    if (dataBearing && !syncedPanelKeys.has(panel?.Key) && !Object.hasOwn(panel || {}, 'DataConnections') && !Object.hasOwn(panel || {}, 'ConnectedToolbars')) {
      diagnostics.push(diagnostic('error', 'DATAFLOW_PANEL_UNSYNCED', path, `Data-bearing panel ${panel?.Key ?? '<missing>'} has no refresh connection.`, 'Add it to an appropriate toolbar OnChangeSyncPanels list.'));
    }
    const panelDatasource = model.get(panel?.Datasource);
    if (panelDatasource) {
      const columnGroups = [
        ['Table', panel?.Table?.Columns || []],
        ['TableV2', panel?.TableV2?.Columns || []]
      ];
      for (const [widget, columns] of columnGroups) {
        for (const [columnIndex, column] of columns.entries()) {
          if (column?.Dimension && !panelDatasource.dimensions.has(column.Dimension)) diagnostics.push(diagnostic('error', 'DATAFLOW_WIDGET_DIMENSION', `${path}.${widget}.Columns[${columnIndex}].Dimension`, `${column.Dimension} is absent from datasource ${panel.Datasource}.`, 'Use a dimension supplied by the panel datasource.'));
          for (const [formatIndex, formatting] of (column?.Formatting || []).entries()) if (formatting?.Tag && !panelDatasource.tags.has(formatting.Tag)) diagnostics.push(diagnostic('error', 'DATAFLOW_WIDGET_MEASURE', `${path}.${widget}.Columns[${columnIndex}].Formatting[${formatIndex}].Tag`, `${formatting.Tag} is absent from datasource ${panel.Datasource}.`, 'Use an exact supplied measure tag.'));
        }
      }
      for (const [dimensionIndex, dimension] of (panel?.AdvanceTable?.Dimensions || []).entries()) if (dimension?.Dimension && !panelDatasource.dimensions.has(dimension.Dimension)) diagnostics.push(diagnostic('error', 'DATAFLOW_WIDGET_DIMENSION', `${path}.AdvanceTable.Dimensions[${dimensionIndex}].Dimension`, `${dimension.Dimension} is absent from datasource ${panel.Datasource}.`, 'Use a dimension supplied by the panel datasource.'));
    }
    if (Object.hasOwn(panel || {}, 'Content')) diagnostics.push(diagnostic(mode === 'new' ? 'error' : 'warning', 'DATAFLOW_STALE_PANEL_CONTENT', `${path}.Content`, 'Panel-level Content is noncanonical and may be stale.', 'Use Textbox.Content for new work; preserve only when unchanged outside modification scope.'));

    const shape = collectConnectionShape(panel);
    const toolbarWrites = syncedPanelKeys.has(panel?.Key);
    if ((shape === 'DataConnections' || shape === 'ConnectedToolbars') && toolbarWrites) diagnostics.push(diagnostic('error', 'DATAFLOW_CONNECTION_DUAL_WRITE', path, `Panel uses ${shape} and toolbar OnChangeSyncPanels simultaneously.`, 'Preserve one source format only; never dual-write.'));
    if (mode === 'new' && shape !== 'OnChangeSyncPanels') diagnostics.push(diagnostic('error', 'DATAFLOW_CONNECTION_NEW_MODE', path, `${shape} is not the new-work authoring form.`, 'Emit toolbar.OnChangeSyncPanels[] for new work.'));
    if (mode === 'modify') {
      const sourcePanel = sourcePanels.get(panel?.Key);
      const sourceShape = collectConnectionShape(sourcePanel || {});
      if (sourcePanel && sourceShape !== shape) diagnostics.push(diagnostic('error', 'DATAFLOW_CONNECTION_NOT_PRESERVED', path, `Connection shape changed from ${sourceShape} to ${shape}.`, 'Inspect DataConnections first and preserve the supplied source format.'));
      if (!sourcePanel && shape !== 'OnChangeSyncPanels') diagnostics.push(diagnostic('error', 'DATAFLOW_CONNECTION_INTRODUCED', path, `New panel introduced ${shape}.`, 'Use OnChangeSyncPanels for newly added panels.'));
    }
    for (const connection of panel?.DataConnections || []) {
      const key = connection?.toolbarKey || connection?.ToolbarKey || connection?.Key || connection?.Toolbar;
      if (key && !toolbarKeys.has(key)) diagnostics.push(diagnostic('error', 'DATAFLOW_DATA_CONNECTION_TOOLBAR', `${path}.DataConnections`, `DataConnection toolbar ${key} does not resolve.`, 'Preserve a resolving source connection.'));
      const toolbar = toolbars.find((item) => item?.Key === key);
      if (connection?.datasource && !datasourceKeys.has(connection.datasource)) diagnostics.push(diagnostic('error', 'DATAFLOW_DATA_CONNECTION_DATASOURCE', `${path}.DataConnections`, `DataConnection datasource ${connection.datasource} does not resolve.`, 'Preserve a resolving source datasource copy.'));
      if (toolbar && connection?.datasource && toolbar.Datasource !== connection.datasource) diagnostics.push(diagnostic('error', 'DATAFLOW_DATA_CONNECTION_DATASOURCE_MISMATCH', `${path}.DataConnections`, `DataConnection datasource ${connection.datasource} disagrees with toolbar ${key}.`, 'Treat toolbar datasource as authoritative and repair only with confirmed scope.'));
      if (toolbar && connection?.dimension && toolbar.Dimension !== connection.dimension) diagnostics.push(diagnostic('error', 'DATAFLOW_DATA_CONNECTION_DIMENSION_MISMATCH', `${path}.DataConnections`, `DataConnection dimension ${connection.dimension} disagrees with toolbar ${key}.`, 'Treat toolbar dimension as authoritative and repair only with confirmed scope.'));
    }
    for (const key of panel?.ConnectedToolbars || []) if (!toolbarKeys.has(typeof key === 'string' ? key : key?.Key)) diagnostics.push(diagnostic('error', 'DATAFLOW_CONNECTED_TOOLBAR', `${path}.ConnectedToolbars`, 'ConnectedToolbars contains a dangling toolbar key.', 'Preserve only resolving source connections.'));
  }

  checkExpressionReferences(report, datasourceKeys, inputKeys, diagnostics);
  validateTokens(report, model, toolbarByDatasourceDimension, diagnostics);
  const clientMeasureValidation = validateClientMeasureTags(report, clientPack, diagnostics);

  const wiringAudit = {
    connectionPrecedence: ['DataConnections', 'ConnectedToolbars', 'OnChangeSyncPanels'],
    toolbars: toolbars.map((toolbar) => {
      const hiddenForViews = Array.isArray(toolbar?.HiddenForViews) ? toolbar.HiddenForViews : [];
      const syncPanels = Array.isArray(toolbar?.OnChangeSyncPanels) ? toolbar.OnChangeSyncPanels : [];
      const invalidatedDatasources = Array.isArray(toolbar?.OnChangeDisablePool) ? toolbar.OnChangeDisablePool : [];
      return {
        key: toolbar?.Key || null,
        caption: toolbar?.Caption || null,
        datasource: toolbar?.Datasource || null,
        dimension: toolbar?.Dimension || null,
        visibleInViews: [...viewKeys].filter((key) => !hiddenForViews.includes(key)),
        hiddenForViews,
        syncPanels,
        invalidatedDatasources,
        duplicateSyncPanels: duplicateArrayValues(syncPanels),
        duplicateHiddenViews: duplicateArrayValues(hiddenForViews),
        duplicateInvalidatedDatasources: duplicateArrayValues(invalidatedDatasources),
        demonstratedRuntimeEffect: syncPanels.length > 0 || invalidatedDatasources.length > 0
      };
    }),
    panels: panelEntries.map(({ panel }) => {
      const profile = panelDataProfile(panel);
      return {
        key: panel?.Key || null,
        viewKey: panelViewKeys.get(panel?.Key) || null,
        datasource: panel?.Datasource || null,
        widgets: [...profile.widgets, ...(profile.textboxHasData ? ['TextboxTokens'] : [])],
        dataBearing: profile.dataBearing,
        connectionShape: collectConnectionShape(panel),
        syncingToolbars: [...(syncingToolbarKeysByPanel.get(panel?.Key) || [])].filter(Boolean).sort()
      };
    })
  };

  const counts = countDiagnostics(diagnostics);
  return {
    schemaVersion: 1,
    kind: 'legacy-vi-dataflow-validation',
    completedAt: new Date().toISOString(),
    candidateFile: document.absolutePath,
    candidateSha256: document.sha256,
    mode,
    clientPack: clientPack?.key || null,
    clientMeasureValidation,
    sourceFile: source?.absolutePath || null,
    graph: {
      datasourceKeys: [...datasourceKeys],
      toolbarKeys: [...toolbarKeys],
      viewKeys: [...viewKeys],
      panelKeys: [...panelKeys],
      inputKeys: [...inputKeys]
    },
    wiringAudit,
    diagnostics,
    counts,
    passed: counts.error === 0
  };
}

if (isMain(import.meta.url)) {
  const { positional, options } = parseCli(process.argv.slice(2));
  if (positional.length !== 1) {
    process.stderr.write('Usage: node validate-dataflow.mjs <candidate.json> --mode <new|modify> [--source <source.json>] [--client-pack-dir <absolute-pack-dir>] [--out-dir <directory>]\n');
    process.exit(2);
  }
  try {
    const result = await validateDataflow(positional[0], options);
    const output = await writeResultPair(result, { outDir: options['out-dir'] || '.', baseName: `${candidateBaseName(positional[0])}.dataflow`, title: 'Legacy VI dataflow validation' });
    process.stdout.write(`${result.passed ? 'PASS' : 'FAIL'} dataflow ${output.jsonPath}\n`);
    if (!result.passed) process.exitCode = 1;
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }
}
