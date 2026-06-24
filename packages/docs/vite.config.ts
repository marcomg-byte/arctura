import { resolve } from 'node:path';
import { makeLibraryConfig } from '../../vite.config';

const config = makeLibraryConfig({
  packageRoot: __dirname,
  entry: {
    index: resolve(__dirname, 'src/index.ts'),
  },
  aliases: [
    {
      find: '@',
      replacement: resolve(__dirname),
    },
  ],
});

export default {
  ...config,
  build: {
    ...config.build,
    emptyOutDir: false,
  },
};
