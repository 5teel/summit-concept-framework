#!/usr/bin/env node

import { randomUUID } from 'node:crypto';
import process from 'node:process';
import { compareReportChange } from './compare-report-change.mjs';
import { validateDataflow } from './validate-dataflow.mjs';
import { validateReportSchema } from './validate-report-schema.mjs';
import { validateTextboxSecurity } from './validate-textbox-security.mjs';
import { candidateBaseName, countDiagnostics, parseCli, writeResultPair } from './validation-core.mjs';

const { positional, options } = parseCli(process.argv.slice(2));
if (positional.length !== 1) {
  process.stderr.write('Usage: node validate-report.mjs <candidate.json> --mode <new|modify> [--source <source.json> --allowed-file <paths.json>] [--client-pack <key>] [--environment <env>] [--session-id <id>] [--out-dir <directory>]\n');
  process.exit(2);
}

try {
  const mode = String(options.mode || '');
  if (!['new', 'modify'].includes(mode)) throw new Error('--mode must be new or modify.');
  if (mode === 'modify' && (!options.source || !options['allowed-file'])) throw new Error('Modify mode requires --source and --allowed-file so preservation and scope are both proven.');
  const candidatePath = positional[0];
  const outDir = options['out-dir'] || '.';
  const sharedOptions = {
    mode,
    source: options.source,
    'client-pack': options['client-pack'],
    environment: options.environment || 'prd',
    'require-wider-panel': options['require-wider-panel'],
    'require-fullscreen-panel': options['require-fullscreen-panel']
  };
  const schema = await validateReportSchema(candidatePath, sharedOptions);
  const skipped = (kind) => ({
    schemaVersion: 1,
    kind,
    completedAt: new Date().toISOString(),
    candidateFile: schema.candidateFile,
    candidateSha256: schema.candidateSha256,
    diagnostics: [{ severity: 'error', code: 'VALIDATION_SKIPPED_INVALID_JSON', path: '$', message: 'Validator was skipped because the candidate is not valid JSON.', remediation: 'Fix JSON syntax, then rerun the full suite.' }],
    counts: { error: 1, warning: 0, info: 0 },
    passed: false
  });
  const dataflow = schema.parsed === false ? skipped('legacy-vi-dataflow-validation') : await validateDataflow(candidatePath, sharedOptions);
  const security = schema.parsed === false ? skipped('legacy-vi-textbox-security-validation') : await validateTextboxSecurity(candidatePath, sharedOptions);
  const validators = [schema, dataflow, security];
  let changeComparison = null;
  if (mode === 'modify' && schema.parsed !== false) {
    changeComparison = await compareReportChange(String(options.source), candidatePath, { 'allowed-file': options['allowed-file'] });
    validators.push(changeComparison);
  }
  const hashes = new Set(validators.map((item) => item.candidateSha256));
  if (hashes.size !== 1) throw new Error('Component validators did not validate the same candidate hash.');
  const diagnostics = validators.flatMap((result) => result.diagnostics.map((item) => ({ ...item, validator: result.kind })));
  const counts = countDiagnostics(diagnostics);
  const completedAt = new Date();
  const validationSessionId = String(options['session-id'] || randomUUID());
  const result = {
    schemaVersion: 1,
    kind: 'legacy-vi-full-validation',
    completedAt: completedAt.toISOString(),
    validUntil: new Date(completedAt.getTime() + 4 * 60 * 60 * 1000).toISOString(),
    validationSessionId,
    candidateFile: schema.candidateFile,
    candidateSha256: schema.candidateSha256,
    mode,
    sourceFile: schema.sourceFile,
    environment: security.environment,
    validatorSummary: validators.map((item) => ({
      kind: item.kind,
      passed: item.passed,
      counts: item.counts
    })),
    diagnostics,
    counts,
    passed: validators.every((item) => item.passed) && counts.error === 0
  };
  const base = candidateBaseName(candidatePath);
  for (const component of [schema, dataflow, security, ...(changeComparison ? [changeComparison] : [])]) {
    const suffix = component.kind.replace(/^legacy-vi-/, '').replace(/-validation$/, '').replaceAll('-', '.');
    await writeResultPair(component, { outDir, baseName: `${base}.${suffix}`, title: component.kind.replaceAll('-', ' ') });
  }
  const output = await writeResultPair(result, { outDir, baseName: `${base}.validation`, title: 'Legacy VI full validation' });
  process.stdout.write(`${result.passed ? 'PASS' : 'FAIL'} full validation ${output.jsonPath}\n`);
  process.stdout.write(`candidate_sha256=${result.candidateSha256}\nvalidation_session_id=${validationSessionId}\nvalid_until=${result.validUntil}\n`);
  if (!result.passed) process.exitCode = 1;
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
