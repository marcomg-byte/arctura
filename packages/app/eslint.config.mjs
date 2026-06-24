import { defineConfig } from 'eslint/config';
import { appConfig } from '../../eslint.config.mjs';

export default defineConfig(
  appConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts', 'tsconfig.tsbuildinfo'],
  }
);
