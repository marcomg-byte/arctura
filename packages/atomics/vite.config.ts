import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { makeLibraryConfig } from '../../vite.config';

export default makeLibraryConfig({
  packageRoot: __dirname,
  entry: {
    index: resolve(__dirname, 'src/index.ts'),
    hooks: resolve(__dirname, 'lib/hooks.ts'),
  },
  aliases: [
    {
      find: '@/lib',
      replacement: resolve(__dirname, 'lib/index.ts'),
    },
    {
      find: '@',
      replacement: resolve(__dirname),
    },
  ],
  external: ['react/jsx-runtime'],
  plugins: [react()],
});
