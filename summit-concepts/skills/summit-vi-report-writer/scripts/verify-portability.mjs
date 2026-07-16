#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readdir, readFile, stat } from 'node:fs/promises';
import { basename, dirname, extname, isAbsolute, relative, resolve, sep } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const skillRoot = resolve(scriptDirectory, '..');
const findings = [];
const integrityNames = new Set(['release-manifest.json', 'checksums.sha256']);
const strippedPushName = ['push-to-', 'uat2.mjs'].join('');
const strippedReferenceName = ['publish-to-', 'uat2.md'].join('');
const forbiddenHost = ['df-api', 'summitinsights', 'com', 'au'].join('.');

async function listFiles(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) {
      add('SYMLINK', fullPath, 'Packaged skill files must not be symbolic links.');
    } else if (entry.isDirectory()) {
      output.push(...await listFiles(fullPath));
    } else {
      output.push(fullPath);
    }
  }
  return output;
}

function relativeName(filePath) {
  return relative(skillRoot, filePath).replaceAll('\\', '/');
}

function escapesRoot(rootPath, targetPath) {
  const pathFromRoot = relative(rootPath, targetPath);
  return pathFromRoot === '..' || pathFromRoot.startsWith(`..${sep}`) || isAbsolute(pathFromRoot);
}

function add(code, file, message) {
  findings.push({ code, file: relativeName(file), message });
}

async function sha256(filePath) {
  return createHash('sha256').update(await readFile(filePath)).digest('hex');
}

const files = await listFiles(skillRoot);
const relativeFiles = new Set(files.map(relativeName));
const functionalFiles = files.filter((file) => !integrityNames.has(relativeName(file)));

if (functionalFiles.length !== 33) add('FUNCTIONAL_FILE_COUNT', skillRoot, `Claude-upload variant requires exactly 33 functional files; received ${functionalFiles.length}.`);
for (const forbidden of ['README.md', 'CHANGELOG.md', 'INSTALL.md', 'INSTALLATION.md']) {
  if (relativeFiles.has(forbidden)) add('FORBIDDEN_TOP_LEVEL_FILE', resolve(skillRoot, forbidden), `${forbidden} must not be inside the installable skill.`);
}
for (const forbidden of [`scripts/${strippedPushName}`, `references/${strippedReferenceName}`]) {
  if (relativeFiles.has(forbidden)) add('LOCAL_PUBLISHER_ARTIFACT_PRESENT', resolve(skillRoot, forbidden), 'The Claude-upload variant must exclude local publishing artifacts.');
}

const requiredReferences = [
  'widget-textbox.md',
  'widget-standardchart.md',
  'widget-table.md',
  'widget-tablev2.md',
  'widget-advancetable.md'
];
const requiredFiles = [
  'SKILL.md',
  'agents/openai.yaml',
  'release-manifest.json',
  'checksums.sha256',
  ...requiredReferences.map((name) => `references/${name}`)
];
for (const name of requiredFiles) {
  if (!relativeFiles.has(name)) add('REQUIRED_FILE_MISSING', resolve(skillRoot, name), 'Required Claude-upload skill file is missing.');
}

const skillPath = resolve(skillRoot, 'SKILL.md');
let skillText = '';
try {
  skillText = await readFile(skillPath, 'utf8');
} catch {
  add('SKILL_MISSING', skillPath, 'SKILL.md is required.');
}
if (skillText) {
  const normalized = skillText.replaceAll('\r\n', '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    add('FRONTMATTER_MISSING', skillPath, 'SKILL.md must start with YAML frontmatter.');
  } else {
    const keys = match[1].split('\n').filter((line) => /^[A-Za-z][A-Za-z0-9_-]*:/.test(line)).map((line) => line.split(':', 1)[0]);
    if (keys.length !== 2 || keys[0] !== 'name' || keys[1] !== 'description') add('FRONTMATTER_KEYS', skillPath, `Frontmatter keys must be exactly name and description; received ${keys.join(', ')}.`);
    if (!/^name:\s*summit-vi-report-writer\s*$/m.test(match[1])) add('FRONTMATTER_NAME', skillPath, 'Skill name must be summit-vi-report-writer.');
    const description = match[1].match(/^description:\s*(.+)$/m)?.[1] || '';
    if (!description.startsWith('Builds, extends, repairs, and validates legacy Visual Insights report definition JSON safely.')) add('FRONTMATTER_DESCRIPTION_PURPOSE', skillPath, 'Description must begin with what the skill does.');
    if (!description.includes('Use when the user wants to create, build, extend, repair, or modify a legacy Visual Insights report definition JSON')) add('FRONTMATTER_DESCRIPTION_TRIGGERS', skillPath, 'Description must include the contract trigger phrase.');
  }
  if (normalized.split('\n').length > 400) add('SKILL_TOO_LONG', skillPath, 'SKILL.md must stay below 400 lines.');
  if (!normalized.includes('## Publishing') || !normalized.includes("Summit's separate local publisher process")) add('PUBLISHING_HANDOFF_MISSING', skillPath, 'Claude-upload SKILL.md must end delivery at validation and name the separate local publisher process.');
  if (normalized.includes(strippedPushName) || normalized.includes(strippedReferenceName)) add('PUBLISHING_ROUTE_PRESENT', skillPath, 'Claude-upload SKILL.md still routes to a stripped publishing artifact.');
}

const openAiPath = resolve(skillRoot, 'agents', 'openai.yaml');
try {
  const openAiText = await readFile(openAiPath, 'utf8');
  const displayName = openAiText.match(/^\s*display_name:\s*"([^"]+)"\s*$/m)?.[1];
  const shortDescription = openAiText.match(/^\s*short_description:\s*"([^"]+)"\s*$/m)?.[1];
  const defaultPrompt = openAiText.match(/^\s*default_prompt:\s*"([^"]+)"\s*$/m)?.[1];
  if (!/^interface:\s*$/m.test(openAiText) || !displayName || !shortDescription || !defaultPrompt) add('OPENAI_METADATA_SHAPE', openAiPath, 'agents/openai.yaml requires quoted interface metadata.');
  if (displayName && displayName !== 'Summit VI Report Writer') add('OPENAI_DISPLAY_NAME', openAiPath, 'display_name must be Summit VI Report Writer.');
  if (shortDescription && (shortDescription.length < 25 || shortDescription.length > 64)) add('OPENAI_SHORT_DESCRIPTION_LENGTH', openAiPath, 'short_description must be 25–64 characters.');
  if (defaultPrompt && !defaultPrompt.includes('$summit-vi-report-writer')) add('OPENAI_DEFAULT_PROMPT_SKILL', openAiPath, 'default_prompt must invoke the skill.');
} catch {
  add('OPENAI_METADATA_MISSING', openAiPath, 'agents/openai.yaml is required.');
}

const textExtensions = new Set(['.md', '.json', '.mjs', '.yaml', '.yml', '.ps1', '.sha256']);
const forbiddenPatterns = [
  ['ABSOLUTE_USER_PATH', /\/Users\/|[A-Za-z]:[\\/]Users[\\/]/],
  ['ABSOLUTE_DRIVE_PATH', /(?:^|[\s"'])[A-Za-z]:[\\/](?![<>])/m],
  ['VAULT_REFERENCE', /Obsidian\s+Vault|evidence\/(?:raw|normalized|decisions)\//i],
  ['SOURCE_URL', /summitinsights\.atlassian\.net/i],
  ['CLIENT_PRESET', /ConfigurationPreset\.Jigsaw\.Url\.(?!<client-preset>)[A-Za-z0-9_-]+/i]
];
const sanctionedClientKey = ['7', '11'].join('');
const sanctionedClientPrefix = `references/clients/${sanctionedClientKey}/`;
const sanctionedDisclaimer = 'This skill ships no client measures. Confirmed client measure packs are supplied at build time from the connected Summit Labs client-packs store; never redistributed in this repo.';
const clientIdentifierPattern = new RegExp(['7\\s*[- ]?\\s*' + 'eleven', 'seven' + 'eleven', '\\b7' + '11\\b'].join('|'), 'i');
const networkImportPattern = /(?:from\s+|import\s*\()['"]node:(?:http|https|net|tls|dns)[/'"]/;
const networkCallPattern = /\b(?:globalThis\.)?fetch\s*\(|\bnew\s+(?:WebSocket|EventSource)\s*\(|\bXMLHttpRequest\s*\(/;

for (const file of files) {
  if (!textExtensions.has(extname(file).toLowerCase()) && basename(file) !== 'checksums.sha256') continue;
  const text = await readFile(file, 'utf8');
  for (const [code, pattern] of forbiddenPatterns) if (pattern.test(text)) add(code, file, 'Packaged file contains a forbidden workspace/source/client-bearing reference.');
  if (text.toLowerCase().includes(forbiddenHost)) add('DATAFOUNDRY_URL', file, 'Claude-upload variant must contain no dataFoundry host reference.');
  if (text.includes(strippedPushName) || text.includes(strippedReferenceName)) add('STRIPPED_ARTIFACT_REFERENCE', file, 'Claude-upload bytes still name a stripped publishing artifact.');
  const name = relativeName(file);
  if (name.startsWith('scripts/') && extname(file).toLowerCase() === '.mjs' && (networkImportPattern.test(text) || networkCallPattern.test(text))) add('NETWORK_CAPABLE_SCRIPT', file, 'Claude-upload scripts must not contain network imports or executable network calls.');
  if (!name.startsWith(sanctionedClientPrefix)) {
    const remaining = text.split(/\r?\n/).filter((line) => !line.includes(sanctionedDisclaimer) && !line.includes(sanctionedClientPrefix)).join('\n');
    if (clientIdentifierPattern.test(remaining)) add('CLIENT_IDENTIFIER_OUTSIDE_EXCEPTION', file, 'Client identifiers are limited to the sanctioned client pack and exact disclaimer.');
  }
  if (extname(file).toLowerCase() === '.json') {
    try { JSON.parse(text); } catch (error) { add('INVALID_JSON', file, error.message); }
  }
  if (extname(file).toLowerCase() === '.md') {
    for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = match[1].split('#', 1)[0];
      if (!target || /^(?:https?:|mailto:)/i.test(target)) continue;
      const resolved = resolve(dirname(file), decodeURIComponent(target));
      if (escapesRoot(skillRoot, resolved)) add('LINK_ESCAPES_SKILL', file, `Link target ${target} escapes the skill root.`);
      try {
        if (!(await stat(resolved)).isFile()) add('LINK_NOT_FILE', file, `Link target ${target} is not a file.`);
      } catch {
        add('BROKEN_LINK', file, `Link target ${target} does not exist.`);
      }
    }
  }
}

try {
  const manifestPath = resolve(skillRoot, 'release-manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (manifest.distributionVariant !== 'claude-upload' || manifest.network?.required !== false || manifest.publishing?.included !== false) add('MANIFEST_VARIANT', manifestPath, 'Manifest must declare the offline Claude-upload distribution boundary.');
  const entries = new Map((manifest.files || []).map((entry) => [entry.path, entry]));
  const expected = files.map(relativeName).filter((name) => !integrityNames.has(name));
  for (const name of expected) {
    const entry = entries.get(name);
    if (!entry) {
      add('MANIFEST_FILE_MISSING', resolve(skillRoot, name), 'Functional file is missing from release-manifest.json.');
      continue;
    }
    const bytes = await readFile(resolve(skillRoot, name));
    const hash = createHash('sha256').update(bytes).digest('hex');
    if (entry.bytes !== bytes.byteLength || entry.sha256 !== hash) add('MANIFEST_HASH_MISMATCH', resolve(skillRoot, name), 'Manifest byte count or SHA-256 does not match staged bytes.');
  }
  for (const name of entries.keys()) if (!expected.includes(name)) add('MANIFEST_EXTRA_FILE', resolve(skillRoot, name), 'Manifest contains a non-functional or absent file.');
} catch (error) {
  add('MANIFEST_INVALID', resolve(skillRoot, 'release-manifest.json'), error.message);
}

try {
  const checksumPath = resolve(skillRoot, 'checksums.sha256');
  const rows = new Map();
  for (const [index, line] of (await readFile(checksumPath, 'utf8')).trimEnd().split(/\r?\n/).entries()) {
    const match = line.match(/^([0-9a-f]{64})  ([^\r\n]+)$/);
    if (!match) {
      add('CHECKSUM_FORMAT', checksumPath, `Invalid checksum line ${index + 1}.`);
      continue;
    }
    rows.set(match[2], match[1]);
  }
  const expected = files.map(relativeName).filter((name) => name !== 'checksums.sha256');
  for (const name of expected) {
    const digest = rows.get(name);
    if (!digest) add('CHECKSUM_FILE_MISSING', resolve(skillRoot, name), 'Staged file is missing from checksums.sha256.');
    else if (digest !== await sha256(resolve(skillRoot, name))) add('CHECKSUM_HASH_MISMATCH', resolve(skillRoot, name), 'Detached checksum does not match staged bytes.');
  }
  for (const name of rows.keys()) if (!expected.includes(name)) add('CHECKSUM_EXTRA_FILE', resolve(skillRoot, name), 'Detached checksums contain an absent or self-referential path.');
} catch (error) {
  add('CHECKSUMS_INVALID', resolve(skillRoot, 'checksums.sha256'), error.message);
}

const result = {
  passed: findings.length === 0,
  distributionVariant: 'claude-upload',
  skillRoot,
  filesChecked: files.length,
  functionalFilesChecked: functionalFiles.length,
  routedWidgetReferences: requiredReferences.length,
  networkRequired: false,
  publishingIncluded: false,
  findings
};
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
if (!result.passed) process.exit(1);
