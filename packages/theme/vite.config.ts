import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname),
      },
    ],
  },
  build: {
    lib: {
      entry: {
        cli: resolve(__dirname, 'src/cli.ts'),
        index: resolve(__dirname, 'src/index.ts'),
        parser: resolve(__dirname, 'src/parser.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => (format === 'es' ? `${entryName}.js` : `${entryName}.cjs`),
    },
    rollupOptions: {
      external: [
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/react-fontawesome',
        'classnames',
        'embla-carousel-fade',
        'embla-carousel-react',
        'node:fs/promises',
        'node:path',
        'node:url',
        'react',
        'react/jsx-runtime',
        'tailwind-merge',
      ],
    },
  },
  plugins: [react()],
});
