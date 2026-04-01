#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';
import { createHash } from 'crypto';

const SKIP_FILES = [
  'src/app/config/brand.ts',
  'src/app/config/sync.ts',
];

const url = process.argv[2];
if (!url) {
  console.error('Usage: node scripts/sync-from-workbench.mjs <workbench-url>');
  process.exit(1);
}

const syncUrl = `${url.replace(/\/$/, '')}/api/sync.json`;
console.log(`Fetching ${syncUrl} ...`);

const res = await fetch(syncUrl);
if (!res.ok) {
  console.error(`Failed to fetch: ${res.status} ${res.statusText}`);
  process.exit(1);
}

const data = await res.json();
console.log(`Sync manifest v${data.version} — ${data.fileCount} files\n`);

let updated = 0;
let skipped = 0;
let unchanged = 0;

for (const [filePath, entry] of Object.entries(data.files)) {
  if (SKIP_FILES.includes(filePath)) {
    console.log(`  SKIP  ${filePath}`);
    skipped++;
    continue;
  }

  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const newContent = entry.source;
  let oldContent = '';
  try {
    oldContent = readFileSync(filePath, 'utf-8');
  } catch {}

  const oldHash = createHash('md5').update(oldContent).digest('hex');
  const newHash = createHash('md5').update(newContent).digest('hex');

  if (oldHash === newHash) {
    unchanged++;
    continue;
  }

  writeFileSync(filePath, newContent);
  console.log(`  WRITE ${filePath}`);
  updated++;
}

console.log(`\nDone: ${updated} updated, ${unchanged} unchanged, ${skipped} skipped`);
