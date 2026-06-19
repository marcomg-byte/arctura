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
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        hooks: resolve(__dirname, 'lib/hooks.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
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
