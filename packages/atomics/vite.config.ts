import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@/lib',
        replacement: resolve(__dirname, 'lib/index.ts'),
      },
      {
        find: '@',
        replacement: resolve(__dirname),
      },
    ],
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: [
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/react-fontawesome',
        'classnames',
        'embla-carousel-fade',
        'embla-carousel-react',
        'react',
        'react/jsx-runtime',
        'tailwind-merge',
      ],
    },
  },
  plugins: [react()],
});
