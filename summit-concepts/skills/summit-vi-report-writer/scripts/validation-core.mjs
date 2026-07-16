#!/usr/bin/env node

import { createHash, randomUUID } from 'node:crypto';
import { realpathSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const STANDARD_DIMENSIONS = [
  'Product',
  'Market',
  'Date',
  'Time',
  'Promotion',
  'Shopper',
  'Basket'
];

export const CONTROL_DIMENSIONS = [...STANDARD_DIMENSIONS, 'Measure'];
export const SUPPORTED_WIDGETS = ['Textbox', 'StandardChart', 'Table', 'TableV2', 'AdvanceTable'];

export function isMain(metaUrl) {
  if (!process.argv[1]) return false;
  const canonical = (filePath) => {
    let value;
    try { value = realpathSync(resolve(filePath)); } catch { value = resolve(filePath); }
    return process.platform === 'win32' ? value.toLowerCase() : value;
  };
  return canonical(process.argv[1]) === canonical(fileURLToPath(metaUrl));
}

export function parseCli(argv) {
  const positional = [];
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith('--')) {
      positional.push(item);
      continue;
    }
    const equalIndex = item.indexOf('=');
    const key = item.slice(2, equalIndex === -1 ? undefined : equalIndex);
    let value = true;
    if (equalIndex !== -1) {
      value = item.slice(equalIndex + 1);
    } else if (argv[index + 1] && !argv[index + 1].startsWith('--')) {
      value = argv[index + 1];
      index += 1;
    }
    if (Object.hasOwn(options, key)) {
      options[key] = Array.isArray(options[key]) ? [...options[key], value] : [options[key], value];
    } else {
      options[key] = value;
    }
  }
  return { positional, options };
}

export function optionList(options, key) {
  if (!Object.hasOwn(options, key) || options[key] === undefined || options[key] === null) return [];
  return Array.isArray(options[key]) ? options[key] : [options[key]];
}

export function diagnostic(severity, code, path, message, remediation) {
  return { severity, code, path, message, remediation };
}

export function countDiagnostics(diagnostics) {
  return diagnostics.reduce(
    (counts, item) => {
      counts[item.severity] = (counts[item.severity] || 0) + 1;
      return counts;
    },
    { error: 0, warning: 0, info: 0 }
  );
}

export function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

export async function readJsonDocument(filePath) {
  const absolutePath = resolve(filePath);
  const text = await readFile(absolutePath, 'utf8');
  let value;
  try {
    value = JSON.parse(text);
  } catch (error) {
    const wrapped = new Error(`Invalid JSON in ${absolutePath}: ${error.message}`);
    wrapped.code = 'INVALID_JSON';
    throw wrapped;
  }
  return {
    absolutePath,
    text,
    value,
    sha256: sha256(text),
    duplicateKeys: findDuplicateJsonKeys(text)
  };
}

export function findDuplicateJsonKeys(text) {
  let cursor = 0;
  const duplicates = [];

  function skipWhitespace() {
    while (/\s/.test(text[cursor] || '')) cursor += 1;
  }

  function parseString() {
    skipWhitespace();
    const start = cursor;
    if (text[cursor] !== '"') throw new Error('Expected JSON string');
    cursor += 1;
    while (cursor < text.length) {
      if (text[cursor] === '\\') {
        cursor += 2;
      } else if (text[cursor] === '"') {
        cursor += 1;
        return JSON.parse(text.slice(start, cursor));
      } else {
        cursor += 1;
      }
    }
    throw new Error('Unterminated JSON string');
  }

  function parseValue(path) {
    skipWhitespace();
    if (text[cursor] === '{') return parseObject(path);
    if (text[cursor] === '[') return parseArray(path);
    if (text[cursor] === '"') return parseString();
    while (cursor < text.length && !/[\s,\]}]/.test(text[cursor])) cursor += 1;
    return undefined;
  }

  function parseObject(path) {
    cursor += 1;
    skipWhitespace();
    const keys = new Set();
    if (text[cursor] === '}') {
      cursor += 1;
      return;
    }
    while (cursor < text.length) {
      const key = parseString();
      const keyPath = path === '$' ? key : `${path}.${key}`;
      if (keys.has(key)) duplicates.push(keyPath);
      keys.add(key);
      skipWhitespace();
      cursor += 1;
      parseValue(keyPath);
      skipWhitespace();
      if (text[cursor] === '}') {
        cursor += 1;
        return;
      }
      cursor += 1;
      skipWhitespace();
    }
  }

  function parseArray(path) {
    cursor += 1;
    skipWhitespace();
    let index = 0;
    if (text[cursor] === ']') {
      cursor += 1;
      return;
    }
    while (cursor < text.length) {
      parseValue(`${path}[${index}]`);
      index += 1;
      skipWhitespace();
      if (text[cursor] === ']') {
        cursor += 1;
        return;
      }
      cursor += 1;
      skipWhitespace();
    }
  }

  try {
    parseValue('$');
  } catch {
    return [];
  }
  return duplicates;
}

export function jsonType(value) {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
}

export function collectPaths(value, path = '$', result = []) {
  result.push({ path, pattern: concreteToPattern(path), type: jsonType(value), value });
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectPaths(item, `${path}[${index}]`, result));
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      collectPaths(item, path === '$' ? key : `${path}.${key}`, result);
    }
  }
  return result;
}

export function concreteToPattern(path) {
  return path.replace(/\[\d+\]/g, '[]');
}

export function getViews(report) {
  return Array.isArray(report?.Views?.Views) ? report.Views.Views : [];
}

export function getToolbars(report) {
  return Array.isArray(report?.Views?.Toolbar) ? report.Views.Toolbar : [];
}

export function getPanels(report) {
  return getViews(report).flatMap((view, viewIndex) =>
    (Array.isArray(view?.Dashboard?.Panels) ? view.Dashboard.Panels : []).map((panel, panelIndex) => ({
      panel,
      view,
      viewIndex,
      panelIndex,
      path: `Views.Views[${viewIndex}].Dashboard.Panels[${panelIndex}]`
    }))
  );
}

export function valuesByKey(items, key = 'Key') {
  return new Map(items.filter((item) => item && item[key] !== undefined).map((item) => [item[key], item]));
}

export function duplicateValues(items, key) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of items) {
    const value = item?.[key];
    if (value === undefined) continue;
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

export function walkStrings(value, visitor, path = '$') {
  if (typeof value === 'string') {
    visitor(value, path);
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => walkStrings(item, visitor, `${path}[${index}]`));
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      walkStrings(item, visitor, path === '$' ? key : `${path}.${key}`);
    }
  }
}

export function extractTokens(text) {
  const tokens = [];
  const pattern = /\$([A-Za-z][A-Za-z0-9]*)(?:\(([^)]*)\))?/g;
  for (const match of text.matchAll(pattern)) {
    const parameters = {};
    if (match[2]) {
      for (const part of match[2].split(',')) {
        const colon = part.indexOf(':');
        if (colon === -1) continue;
        parameters[part.slice(0, colon).trim()] = part.slice(colon + 1).trim();
      }
    }
    tokens.push({ raw: match[0], name: match[1], arguments: match[2] || '', parameters, index: match.index });
  }
  return tokens;
}

export function findStrayDollars(text, allowedBare = []) {
  const covered = new Set();
  for (const token of extractTokens(text)) {
    for (let index = token.index; index < token.index + token.raw.length; index += 1) covered.add(index);
  }
  const stray = [];
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== '$' || covered.has(index)) continue;
    if (text.slice(index).startsWith('&#36;')) continue;
    if (allowedBare.some((value) => text.slice(index).startsWith(value))) continue;
    stray.push(index);
  }
  return stray;
}

export function inventoryReport(report) {
  const views = getViews(report);
  const panels = getPanels(report);
  const widgetCounts = Object.fromEntries(SUPPORTED_WIDGETS.map((widget) => [widget, 0]));
  const unknownWidgets = {};
  for (const { panel } of panels) {
    for (const key of Object.keys(panel || {})) {
      if (SUPPORTED_WIDGETS.includes(key)) widgetCounts[key] += 1;
      if (/^(Textbox|StandardChart|Table|TableV2|AdvanceTable|IFrame|Chart)/.test(key) && !SUPPORTED_WIDGETS.includes(key)) {
        unknownWidgets[key] = (unknownWidgets[key] || 0) + 1;
      }
    }
  }
  const tokenCounts = {};
  walkStrings(report, (value) => {
    for (const token of extractTokens(value)) tokenCounts[token.name] = (tokenCounts[token.name] || 0) + 1;
  });
  return {
    title: report?.General?.Title ?? report?.Title ?? null,
    topLevelKeys: Object.keys(report || {}).sort(),
    pages: Array.isArray(report?.Pages) ? report.Pages.length : 0,
    datasources: Array.isArray(report?.Datasources) ? report.Datasources.length : 0,
    datasourceKeys: (report?.Datasources || []).map((item) => item?.Key).filter(Boolean),
    toolbars: getToolbars(report).length,
    toolbarKeys: getToolbars(report).map((item) => item?.Key).filter(Boolean),
    views: views.length,
    viewTitles: views.map((item) => item?.Title ?? item?.Key ?? '<untitled>'),
    panels: panels.length,
    panelsByView: views.map((view) => ({
      key: view?.Key ?? null,
      title: view?.Title ?? null,
      count: Array.isArray(view?.Dashboard?.Panels) ? view.Dashboard.Panels.length : 0
    })),
    widgetCounts,
    unknownWidgets,
    tokenCounts
  };
}

export function deepDiff(before, after, path = '$', output = []) {
  if (Object.is(before, after)) return output;
  const beforeType = jsonType(before);
  const afterType = jsonType(after);
  if (beforeType !== afterType || !['array', 'object'].includes(beforeType)) {
    output.push({ path, before, after, kind: before === undefined ? 'added' : after === undefined ? 'removed' : 'changed' });
    return output;
  }
  if (Array.isArray(before)) {
    const length = Math.max(before.length, after.length);
    for (let index = 0; index < length; index += 1) deepDiff(before[index], after[index], `${path}[${index}]`, output);
    return output;
  }
  for (const key of new Set([...Object.keys(before || {}), ...Object.keys(after || {})])) {
    deepDiff(before?.[key], after?.[key], path === '$' ? key : `${path}.${key}`, output);
  }
  return output;
}

export function isPathAllowed(path, prefixes) {
  return prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}.`) || path.startsWith(`${prefix}[`));
}

export function markdownDiagnostics(title, result) {
  const counts = result.counts || countDiagnostics(result.diagnostics || []);
  const lines = [
    `# ${title}`,
    '',
    `Result: **${result.passed ? 'PASS' : 'FAIL'}**`,
    '',
    `Errors: ${counts.error || 0}; warnings: ${counts.warning || 0}; info: ${counts.info || 0}.`,
    ''
  ];
  if (result.candidateSha256) lines.push(`Candidate SHA-256: \`${result.candidateSha256}\``, '');
  if (result.diagnostics?.length) {
    lines.push('| Severity | Code | Path | Message | Remediation |', '|---|---|---|---|---|');
    for (const item of result.diagnostics) {
      const values = [item.severity, item.code, item.path, item.message, item.remediation].map((value) =>
        String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ')
      );
      lines.push(`| ${values.join(' | ')} |`);
    }
  } else {
    lines.push('No diagnostics.');
  }
  lines.push('');
  return `${lines.join('\n')}\n`;
}

export async function writeResultPair(result, { outDir, baseName, title }) {
  const targetDirectory = resolve(outDir || '.');
  await mkdir(targetDirectory, { recursive: true });
  const jsonPath = resolve(targetDirectory, `${baseName}.json`);
  const markdownPath = resolve(targetDirectory, `${baseName}.md`);
  await writeFile(jsonPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  await writeFile(markdownPath, markdownDiagnostics(title, result), 'utf8');
  return { jsonPath, markdownPath };
}

export function createBaseResult(kind, document, extra = {}) {
  return {
    schemaVersion: 1,
    kind,
    sessionId: randomUUID(),
    completedAt: new Date().toISOString(),
    candidateFile: document.absolutePath,
    candidateSha256: document.sha256,
    ...extra
  };
}

export function candidateBaseName(filePath) {
  return basename(filePath).replace(/\.json$/i, '');
}

export function relativeOutputBeside(candidatePath, suffix) {
  const absolute = resolve(candidatePath);
  return resolve(dirname(absolute), `${candidateBaseName(absolute)}.${suffix}`);
}

export async function writeJson(filePath, value) {
  await mkdir(dirname(resolve(filePath)), { recursive: true });
  await writeFile(resolve(filePath), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export function requireObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
