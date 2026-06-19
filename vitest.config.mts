import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['packages/*/vitest.config.mts'],
    coverage: {
      provider: 'istanbul',
      include: ['packages/*/src/**/*.{ts,tsx}', 'packages/*/lib/**/*.{ts,tsx}'],
      exclude: ['**/*.spec.{ts,tsx}', '**/*.test.{ts,tsx}', '**/dist/**', '**/coverage/**'],
      reporter: ['text', 'json-summary', 'html'],
    },
  },
});
