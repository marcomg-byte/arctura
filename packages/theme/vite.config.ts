import { resolve } from 'node:path';
import { makeLibraryConfig } from '../../vite.config';

export default makeLibraryConfig({
  packageRoot: __dirname,
  entry: {
    cli: resolve(__dirname, 'src/cli.ts'),
    index: resolve(__dirname, 'src/index.ts'),
    parser: resolve(__dirname, 'src/parser.ts'),
  },
  aliases: [
    {
      find: '@',
      replacement: resolve(__dirname),
    },
  ],
  external: ['react/jsx-runtime'],
});
