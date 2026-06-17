import { defineConfig } from 'eslint/config';
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
    ignores: ['dist/**', 'node_modules/**', '**/*.d.ts', '**/*.d.ts.map'],
  }
);
