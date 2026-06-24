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

const appConfig = defineConfig([
  {
    ignores: [
      '**/.next/**',
      '**/out/**',
      '**/node_modules/**',
      '**/*.d.ts',
      '**/*.d.ts.map',
      '**/tsconfig.tsbuildinfo',
    ],
  },
  {
    ...js.configs.recommended,
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.node,
    },
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
    },
    settings: {
      next: {
        rootDir: ['packages/app/'],
      },
      react: {
        version: 'detect',
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
    files: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: [
      'eslint.config.mjs',
      'postcss.config.mjs',
      'next.config.ts',
      'tailwind.config.ts',
      '**/*.config.{js,mjs,cjs,ts,mts}',
    ],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['**/*.json'],
    ignores: ['node_modules/**', '.next/**', 'out/**'],
    plugins: { json: jsonPlugin },
    language: 'json/json',
    extends: ['json/recommended'],
  },
]);

export { appConfig, libraryConfig };
export default libraryConfig;
