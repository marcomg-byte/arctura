import { defineConfig } from 'eslint/config';
import { libraryConfig } from '../../eslint.config.mjs';

export default defineConfig(
  libraryConfig,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**'],
  }
);
