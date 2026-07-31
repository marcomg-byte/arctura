import { OptionDefaults } from 'typedoc';

/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
  name: 'Arctura Atomics Components',
  entryPoints: ['src/atomics-components.ts'],
  entryPointStrategy: 'resolve',
  tsconfig: 'tsconfig.json',
  plugin: ['typedoc-plugin-markdown'],
  outputs: [
    {
      name: 'json',
      path: 'dist/atomics-components.json',
    },
    {
      name: 'markdown',
      path: 'dist/markdown',
    },
  ],
  readme: 'none',
  includeVersion: true,
  excludePrivate: true,
  excludeProtected: true,
  excludeInternal: true,
  excludeExternals: true,
  cleanOutputDir: true,
  blockTags: [...OptionDefaults.blockTags, '@component', '@description'],
  validation: {
    notExported: false,
    invalidLink: true,
    invalidPath: true,
    rewrittenLink: true,
    notDocumented: false,
    unusedMergeModuleWith: true,
  },
};

export default config;
