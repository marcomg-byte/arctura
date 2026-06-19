import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@/lib',
        replacement: resolve(__dirname, 'lib/index.ts'),
      },
      {
        find: '@/tokens.json',
        replacement: resolve(__dirname, 'tokens.json'),
      },
      {
        find: '@',
        replacement: resolve(__dirname),
      },
    ],
    tsconfigPaths: true,
  },
  test: {
    name: 'atomics',
    environment: 'jsdom',
  },
});
