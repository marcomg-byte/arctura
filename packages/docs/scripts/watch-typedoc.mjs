import { existsSync, mkdirSync, watch } from 'node:fs';
import { spawn } from 'node:child_process';
import { dirname } from 'node:path';
import { docsJsonPath, enrichTypedocProperties } from './enrich-typedoc-properties.mjs';

const typedocCommand = process.platform === 'win32' ? 'typedoc.cmd' : 'typedoc';
let debounce;
const docsOutputDir = dirname(docsJsonPath);

const enrich = () => {
  clearTimeout(debounce);
  debounce = setTimeout(async () => {
    if (!existsSync(docsJsonPath)) return;

    try {
      await enrichTypedocProperties();
    } catch (error) {
      console.error(error);
    }
  }, 100);
};

const child = spawn(typedocCommand, ['--options', 'typedoc.config.mjs', '--watch'], {
  shell: true,
  stdio: 'inherit',
});

mkdirSync(docsOutputDir, { recursive: true });
watch(docsOutputDir, enrich);

enrich();

const stop = () => {
  child.kill();
  process.exit();
};

process.on('SIGINT', stop);
process.on('SIGTERM', stop);
