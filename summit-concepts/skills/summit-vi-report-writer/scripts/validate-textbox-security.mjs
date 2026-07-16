#!/usr/bin/env node

import process from 'node:process';
import {
  candidateBaseName,
  countDiagnostics,
  diagnostic,
  extractTokens,
  findStrayDollars,
  getPanels,
  isMain,
  parseCli,
  readJsonDocument,
  writeResultPair
} from './validation-core.mjs';

const RECOGNISED_TEXTBOX_TOKENS = new Set(['LabelOfSelected', 'DataOfSelected', 'LabelOfAll', 'LabelOfTag', 'Input', 'ConfigurationPreset']);
const ENVIRONMENT_CDN = {
  dev: 'vi-cdn-dev.azureedge.net',
  uat: 'vi-cdn-uat.azureedge.net',
  uat2: 'vi-cdn-uat2.azureedge.net',
  prd: 'vi-cdn.azureedge.net'
};

const RULE_PATTERNS = [
  {
    code: 'SECURITY_NETWORK',
    pattern: /\b(fetch|XMLHttpRequest|axios|WebSocket|EventSource)\b|\$\.ajax|navigator\.sendBeacon/i,
    message: 'Textbox contains a prohibited network-capable API.',
    remediation: 'Remove the call; Textbox content may not make network requests, including same-origin calls.'
  },
  {
    code: 'SECURITY_SECRET',
    pattern: /\b(Authorization|Bearer\s+[A-Za-z0-9._-]+|api[_-]?key|client[_-]?secret|password|access[_-]?token|sk-[A-Za-z0-9_-]+|AIza[A-Za-z0-9_-]+|AKIA[A-Z0-9]+|ghp_[A-Za-z0-9]+)\b\s*[:=]?|\b(?:atob|btoa)\s*\(/i,
    message: 'Textbox contains a credential/secret indicator.',
    remediation: 'Remove credentials and secret-bearing logic; never obfuscate or embed them.'
  },
  {
    code: 'SECURITY_STORAGE',
    pattern: /document\.cookie|\b(localStorage|sessionStorage|indexedDB)\b|navigator\.credentials/i,
    message: 'Textbox uses prohibited browser storage, cookies, or credentials.',
    remediation: 'Use ephemeral in-memory DOM/window state only where genuinely required.'
  },
  {
    code: 'SECURITY_DYNAMIC_CODE',
    pattern: /\beval\s*\(|\bFunction\s*\(|set(?:Timeout|Interval)\s*\(\s*['"`]|\bimport\s*\(/i,
    message: 'Textbox uses prohibited dynamic code execution.',
    remediation: 'Use static functions and function-form timers only.'
  },
  {
    code: 'SECURITY_EXTERNAL_LOADER',
    pattern: /<\s*(script|link)\b[^>]*(src|href)\s*=|@import\b|url\s*\(\s*['"]?https?:|\b(new\s+)?(SharedWorker|Worker)\s*\(|serviceWorker\.register/i,
    message: 'Textbox loads an external script, style, worker, or module.',
    remediation: 'Keep HTML/CSS/JS self-contained and CSP-compatible.'
  },
  {
    code: 'SECURITY_IFRAME',
    pattern: /<\s*iframe\b/i,
    message: 'Iframes are outside the legacy builder authoring surface.',
    remediation: 'Use a native widget or policy-compliant Textbox; route hosted apps through the separate approved track.'
  },
  {
    code: 'SECURITY_META_REFRESH',
    pattern: /<\s*meta\b[^>]*http-equiv\s*=\s*['"]?refresh/i,
    message: 'Textbox contains prohibited meta refresh navigation.',
    remediation: 'Remove automatic navigation.'
  },
  {
    code: 'SECURITY_JAVASCRIPT_URI',
    pattern: /(?:href|src|action)\s*=\s*['"]\s*javascript:/i,
    message: 'Textbox contains a javascript URI.',
    remediation: 'Use event listeners and relative same-origin navigation where required.'
  }
];

function attrValues(content, attribute) {
  const pattern = new RegExp(`\\b${attribute}\\s*=\\s*(["'])(.*?)\\1`, 'gis');
  return [...content.matchAll(pattern)].map((match) => match[2].trim());
}

function validateImages(content, path, environment, diagnostics) {
  const expected = ENVIRONMENT_CDN[environment];
  for (const source of attrValues(content, 'src')) {
    if (source.startsWith('$ConfigurationPreset.')) continue;
    if (source.startsWith('data:')) {
      diagnostics.push(diagnostic('error', 'SECURITY_IMAGE_DATA_URI', path, 'Inline data-URI images are not the environment CDN.', `Use https://${expected}/... or a supplied preset.`));
      continue;
    }
    if (source.startsWith('blob:') || /\.blob\.core\.windows\.net/i.test(source)) {
      diagnostics.push(diagnostic('error', 'SECURITY_IMAGE_STORAGE', path, `Image source ${source} uses prohibited blob/raw storage.`, 'Use the correct vi-cdn environment host or a supplied inline preset.'));
      continue;
    }
    if (/^https?:\/\//i.test(source)) {
      let host;
      try {
        host = new URL(source).hostname.toLowerCase();
      } catch {
        host = '';
      }
      if (host !== expected) diagnostics.push(diagnostic('error', 'SECURITY_IMAGE_CDN', path, `Image host ${host || '<invalid>'} does not match ${environment}.`, `Use https://${expected}/... for this environment.`));
    } else if (!source.startsWith('/')) {
      diagnostics.push(diagnostic('error', 'SECURITY_IMAGE_PATH', path, `Image source ${source} is neither the environment CDN nor an absolute same-origin path.`, `Use https://${expected}/... or a supplied preset.`));
    }
  }
}

function validateNavigation(content, path, diagnostics) {
  for (const attribute of ['href', 'action']) {
    for (const target of attrValues(content, attribute)) {
      if (target.startsWith('#')) continue;
      if (!target.startsWith('/')) diagnostics.push(diagnostic('error', 'SECURITY_NAVIGATION', path, `${attribute} target ${target} is not a relative same-origin path.`, 'Use a path beginning with /, or a local # target for CSS disclosure.'));
    }
  }
  const assignments = /(?:window\.|document\.)?location(?:\.href)?\s*=\s*(["'])(.*?)\1/gis;
  for (const match of content.matchAll(assignments)) {
    if (!match[2].startsWith('/')) diagnostics.push(diagnostic('error', 'SECURITY_LOCATION', path, `Location target ${match[2]} is not relative same-origin.`, 'Use a path beginning with /.'));
  }
}

function validateTokensAndDollars(content, path, diagnostics) {
  for (const token of extractTokens(content)) {
    if (!RECOGNISED_TEXTBOX_TOKENS.has(token.name)) diagnostics.push(diagnostic('error', 'SECURITY_UNKNOWN_TOKEN', path, `Unrecognised Textbox token ${token.raw}.`, 'Use an approved token in its documented context.'));
    if (token.arguments.includes('DimensionName:')) diagnostics.push(diagnostic('error', 'SECURITY_TOKEN_PARAMETER', path, 'Token uses denied DimensionName parameter.', 'Use Dimension: exactly.'));
  }
  for (const index of findStrayDollars(content)) diagnostics.push(diagnostic('error', 'SECURITY_STRAY_DOLLAR', `${path}@${index}`, 'Unrecognised literal dollar can silently spool the report.', 'Use a recognised token or encode static currency as &#36;.'));
}

export async function validateTextboxSecurity(candidatePath, options = {}) {
  const environment = String(options.environment || 'prd').toLowerCase();
  if (!Object.hasOwn(ENVIRONMENT_CDN, environment)) throw new Error('--environment must be dev, uat, uat2, or prd.');
  const document = await readJsonDocument(candidatePath);
  const diagnostics = [];
  let textboxCount = 0;
  for (const { panel, path } of getPanels(document.value)) {
    if (!panel?.Textbox) continue;
    textboxCount += 1;
    const contentPath = `${path}.Textbox.Content`;
    const content = panel.Textbox.Content;
    if (typeof content !== 'string') {
      diagnostics.push(diagnostic('error', 'SECURITY_CONTENT_TYPE', contentPath, 'Textbox.Content must be a string.', 'Use a static HTML/CSS/token string.'));
      continue;
    }
    for (const rule of RULE_PATTERNS) if (rule.pattern.test(content)) diagnostics.push(diagnostic('error', rule.code, contentPath, rule.message, rule.remediation));
    validateImages(content, contentPath, environment, diagnostics);
    validateNavigation(content, contentPath, diagnostics);
    validateTokensAndDollars(content, contentPath, diagnostics);
    if (/\son(?:click|error|load|change|input|mouseover|keydown)\s*=/i.test(content)) diagnostics.push(diagnostic('warning', 'SECURITY_INLINE_HANDLER', contentPath, 'Inline event handler is currently permitted but on a CSP deprecation path.', 'Prefer pure CSS or delegated addEventListener; require automated verification and IT sign-off.'));
    if (/<\s*script\b/i.test(content)) diagnostics.push(diagnostic('warning', 'SECURITY_SCRIPT_TIER', contentPath, 'Script-bearing Textbox is a deprecating Tier-2 pattern.', 'Use native widgets or pure HTML/CSS where possible and obtain IT sign-off.'));
    if (/\b(alert|confirm|prompt)\s*\(|\bconsole\.[A-Za-z]+\s*\(|\bdebugger\b/i.test(content)) {
      diagnostics.push(
        diagnostic(
          environment === 'prd' ? 'error' : 'warning',
          'SECURITY_DEBUG_CODE',
          contentPath,
          `Debug code is ${environment === 'prd' ? 'prohibited' : 'temporary-only'} in ${environment}.`,
          'Remove alert/confirm/prompt, console methods, and debugger before PRD.'
        )
      );
    }
  }
  const counts = countDiagnostics(diagnostics);
  return {
    schemaVersion: 1,
    kind: 'legacy-vi-textbox-security-validation',
    completedAt: new Date().toISOString(),
    candidateFile: document.absolutePath,
    candidateSha256: document.sha256,
    environment,
    textboxCount,
    diagnostics,
    counts,
    passed: counts.error === 0
  };
}

if (isMain(import.meta.url)) {
  const { positional, options } = parseCli(process.argv.slice(2));
  if (positional.length !== 1) {
    process.stderr.write('Usage: node validate-textbox-security.mjs <candidate.json> [--environment <dev|uat|uat2|prd>] [--out-dir <directory>]\n');
    process.exit(2);
  }
  try {
    const result = await validateTextboxSecurity(positional[0], options);
    const output = await writeResultPair(result, { outDir: options['out-dir'] || '.', baseName: `${candidateBaseName(positional[0])}.security`, title: 'Legacy VI Textbox security validation' });
    process.stdout.write(`${result.passed ? 'PASS' : 'FAIL'} Textbox security ${output.jsonPath}\n`);
    if (!result.passed) process.exitCode = 1;
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }
}
