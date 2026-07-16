#!/usr/bin/env node

import process from 'node:process';
import { candidateBaseName, inventoryReport, parseCli, readJsonDocument, writeResultPair } from './validation-core.mjs';

const { positional, options } = parseCli(process.argv.slice(2));
if (positional.length !== 1) {
  process.stderr.write('Usage: node inventory-report.mjs <report.json> [--out-dir <directory>]\n');
  process.exit(2);
}

try {
  const document = await readJsonDocument(positional[0]);
  const inventory = inventoryReport(document.value);
  const result = {
    schemaVersion: 1,
    kind: 'legacy-vi-inventory',
    completedAt: new Date().toISOString(),
    candidateFile: document.absolutePath,
    candidateSha256: document.sha256,
    passed: true,
    counts: { error: 0, warning: 0, info: 1 },
    diagnostics: [
      {
        severity: 'info',
        code: 'INVENTORY_COMPLETE',
        path: '$',
        message: `Inventoried ${inventory.views} views, ${inventory.datasources} datasources, and ${inventory.panels} panels.`,
        remediation: 'Use the inventory to confirm source suitability and change scope.'
      }
    ],
    inventory
  };
  const output = await writeResultPair(result, {
    outDir: options['out-dir'] === true ? '.' : options['out-dir'] || '.',
    baseName: `${candidateBaseName(positional[0])}.inventory`,
    title: 'Legacy VI report inventory'
  });
  process.stdout.write(`PASS inventory ${output.jsonPath}\n`);
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
