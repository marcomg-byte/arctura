import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import jsonPlugin from '@eslint/json';

const libraryConfig = defineConfig([
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/*.d.ts', '**/*.d.ts.map'],
  },
  {
    ...js.configs.recommended,
    files: ['**/*.{js,mjs,cjs}'],
  },
  prettierConfig,
  prettierRecommended,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, reactHooks.configs.flat.recommended],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': 'off',
      'no-redeclare': 'off',
      'max-len': [
        'error',
        {
          code: 140,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/{vite,vitest}.config.{ts,mts}'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['**/*.json'],
    ignores: ['node_modules/**', 'dist/**'],
    plugins: { json: jsonPlugin },
    language: 'json/json',
    extends: ['json/recommended'],
  },
]);

export { libraryConfig };
export default libraryConfig;
