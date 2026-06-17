import { defineConfig } from 'eslint/config';
import { libraryConfig } from '../../eslint.config.mjs';

export default defineConfig(libraryConfig, {
  languageOptions: {
    parserOptiopns: {
      project: ['./tsconfig.eslint.json'],
      tsConfigRootDir: import.meta.dirname
    }
  },
  ignores: ['dist/**', 'node_modules/**', 'eslint.config.mjs', '**/*.d.ts', '**/*.d.ts.map']
});
