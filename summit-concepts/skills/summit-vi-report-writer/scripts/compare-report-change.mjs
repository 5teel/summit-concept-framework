#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import process from 'node:process';
import {
  candidateBaseName,
  countDiagnostics,
  deepDiff,
  diagnostic,
  isPathAllowed,
  isMain,
  optionList,
  parseCli,
  readJsonDocument,
  writeResultPair
} from './validation-core.mjs';

export async function compareReportChange(sourcePath, candidatePath, options = {}) {
  const source = await readJsonDocument(sourcePath);
  const candidate = await readJsonDocument(candidatePath);
  let allowed = optionList(options, 'allowed-path').map(String);
  if (options['allowed-file']) {
    const supplied = JSON.parse(await readFile(String(options['allowed-file']), 'utf8'));
    if (!Array.isArray(supplied) || supplied.some((item) => typeof item !== 'string')) {
      throw new Error('--allowed-file must contain a JSON array of path strings.');
    }
    allowed = [...allowed, ...supplied];
  }
  if (allowed.length === 0) throw new Error('At least one --allowed-path or --allowed-file entry is required.');

  const differences = deepDiff(source.value, candidate.value).filter((item) => item.path !== '$');
  const diagnostics = [];
  for (const item of differences) {
    if (!isPathAllowed(item.path, allowed)) {
      diagnostics.push(
        diagnostic(
          'error',
          'CHANGE_OUTSIDE_SCOPE',
          item.path,
          `Candidate ${item.kind} a value outside the confirmed change scope.`,
          'Revert this change or add the exact path to a newly confirmed scope file.'
        )
      );
    }
  }
  if (differences.length === 0) {
    diagnostics.push(diagnostic('warning', 'CHANGE_NONE', '$', 'Source and candidate are identical.', 'Confirm that a modification is still required.'));
  }
  const counts = countDiagnostics(diagnostics);
  return {
    schemaVersion: 1,
    kind: 'legacy-vi-change-comparison',
    completedAt: new Date().toISOString(),
    sourceFile: source.absolutePath,
    sourceSha256: source.sha256,
    candidateFile: candidate.absolutePath,
    candidateSha256: candidate.sha256,
    allowedPaths: [...new Set(allowed)].sort(),
    differenceCount: differences.length,
    differences,
    diagnostics,
    counts,
    passed: counts.error === 0
  };
}

if (isMain(import.meta.url)) {
  const { positional, options } = parseCli(process.argv.slice(2));
  if (positional.length !== 2) {
    process.stderr.write('Usage: node compare-report-change.mjs <source.json> <candidate.json> (--allowed-path <path> | --allowed-file <file>) [--out-dir <directory>]\n');
    process.exit(2);
  }
  try {
    const result = await compareReportChange(positional[0], positional[1], options);
    const output = await writeResultPair(result, {
      outDir: options['out-dir'] || '.',
      baseName: `${candidateBaseName(positional[1])}.change`,
      title: 'Legacy VI change-scope comparison'
    });
    process.stdout.write(`${result.passed ? 'PASS' : 'FAIL'} change comparison ${output.jsonPath}\n`);
    if (!result.passed) process.exitCode = 1;
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }
}
