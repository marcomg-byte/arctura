import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname),
      },
    ],
  },
  test: {
    name: 'docs',
    environment: 'jsdom',
  },
});
