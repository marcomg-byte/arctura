import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { libraryConfig } from '../../eslint.config.mjs';

export default defineConfig(
  libraryConfig,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    ignores: ['coverage/**', 'dist/**', 'node_modules/**', '**/*.d.ts', '**/*.d.ts.map'],
  }
);
