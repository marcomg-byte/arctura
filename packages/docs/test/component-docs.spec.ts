import { describe, expect, it } from 'vitest';
import { commentText, getBlockTag } from '../src/comments';
import {
  findReflection,
  findReflections,
  getComponentDocs,
  getComponentMarkdownFiles,
} from '../src';
import type { TypeDocReflection } from '../src';

const docsFixture: TypeDocReflection = {
  name: 'Arctura Atomics Components',
  children: [
    {
      name: 'ButtonProps',
      kind: 2097152,
      comment: {
        summary: [
          {
            text: 'Props for the Button component.',
          },
        ],
      },
      type: {
        type: 'intersection',
        types: [
          {
            type: 'reference',
            name: 'BaseProps',
          },
        ],
      },
    },
    {
      name: 'Button',
      kind: 64,
      signatures: [
        {
          name: 'Button',
          comment: {
            summary: [
              {
                text: 'Button component supporting anchor and button variants.',
              },
            ],
            blockTags: [
              {
                tag: '@returns',
                content: [
                  {
                    text: 'The rendered button element.',
                  },
                ],
              },
              {
                tag: '@example',
                content: [
                  {
                    kind: 'code',
                    text: '```tsx\n<Button>Save</Button>\n```',
                  },
                ],
              },
            ],
          },
          parameters: [
            {
              name: 'props',
              comment: {
                summary: [
                  {
                    text: 'Button or anchor props.',
                  },
                ],
              },
              type: {
                type: 'reference',
                name: 'ButtonProps',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'Button',
      kind: 64,
    },
    {
      name: 'TextInputProps',
      kind: 256,
    },
    {
      name: 'TextInput',
      kind: 4,
    },
    {
      name: 'TextInput',
      kind: 32,
    },
    {
      name: 'Callable',
      signatures: [
        {
          name: 'CallableSignature',
          parameters: [
            {
              name: 'callableProps',
            },
          ],
        },
      ],
    },
    {
      name: 'SummaryOnly',
      kind: 32,
      comment: {
        summary: [
          {
            text: 'Summary from the component reflection.',
          },
        ],
      },
    },
    {
      name: 'UnknownKind',
      kind: 999,
    },
    {
      name: 'NoKind',
    },
    {
      name: 'Nested',
      type: {
        declaration: {
          children: [
            {
              name: 'NestedReflection',
            },
          ],
        },
      },
    },
  ],
};

describe('arctura-docs', () => {
  describe('comment helpers', () => {
    it('normalizes missing and partial TypeDoc comment parts', () => {
      expect(commentText()).toBe('');
      expect(commentText([{ text: '  Hello ' }, {}, { text: 'world  ' }])).toBe('Hello world');
    });

    it('finds block tags when present and returns undefined for missing tags', () => {
      const reflection = findReflection(docsFixture, 'Button')?.signatures?.[0];

      expect(getBlockTag(reflection, '@example')?.tag).toBe('@example');
      expect(getBlockTag(reflection, '@deprecated')).toBeUndefined();
      expect(getBlockTag(undefined, '@example')).toBeUndefined();
    });
  });

  describe('findReflection', () => {
    it('finds top-level and nested TypeDoc reflections by name', () => {
      expect(findReflection(docsFixture, 'Button')?.name).toBe('Button');
      expect(findReflection(docsFixture, 'NestedReflection')?.name).toBe('NestedReflection');
    });

    it('finds reflections inside signatures and parameters', () => {
      expect(findReflection(docsFixture, 'CallableSignature')?.name).toBe('CallableSignature');
      expect(findReflection(docsFixture, 'callableProps')?.name).toBe('callableProps');
    });

    it('finds all reflections with the same name', () => {
      expect(
        findReflections(docsFixture, 'TextInput').map((reflection) => reflection.kind)
      ).toEqual([4, 32]);
    });

    it('returns an empty list when collecting from a missing root node', () => {
      expect(findReflections(undefined, 'TextInput')).toEqual([]);
    });

    it('returns undefined when the root node is missing', () => {
      expect(findReflection(undefined, 'Button')).toBeUndefined();
    });

    it('returns undefined when a reflection cannot be found', () => {
      expect(findReflection(docsFixture, 'MissingComponent')).toBeUndefined();
    });
  });

  describe('getComponentDocs', () => {
    it('extracts component documentation from a TypeDoc JSON tree', () => {
      expect(getComponentDocs(docsFixture, 'Button')).toMatchObject({
        name: 'Button',
        description: 'Button component supporting anchor and button variants.',
        example: '```tsx\n<Button>Save</Button>\n```',
        returns: 'The rendered button element.',
        propsDescription: 'Props for the Button component.',
        parameters: [
          {
            name: 'props',
            description: 'Button or anchor props.',
            type: {
              type: 'reference',
              name: 'ButtonProps',
            },
          },
        ],
      });
    });

    it('supports a custom props reflection name', () => {
      const result = getComponentDocs(docsFixture, 'Button', {
        propsName: 'ButtonProps',
      });

      expect(result.propsReflection?.name).toBe('ButtonProps');
    });

    it('falls back to component summary when no signature is available', () => {
      expect(getComponentDocs(docsFixture, 'SummaryOnly')).toMatchObject({
        name: 'SummaryOnly',
        description: 'Summary from the component reflection.',
        example: '',
        parameters: [],
        propsDescription: '',
        returns: '',
        signatures: [],
      });
    });

    it('returns empty defaults when the component is missing', () => {
      expect(getComponentDocs(docsFixture, 'MissingComponent')).toMatchObject({
        description: '',
        example: '',
        parameters: [],
        propsDescription: '',
        returns: '',
        signatures: [],
      });
    });
  });

  describe('getComponentMarkdownFiles', () => {
    it('returns component and props markdown files for function components', () => {
      expect(getComponentMarkdownFiles(docsFixture, 'Button')).toMatchObject([
        {
          name: 'Button',
          role: 'component',
          kind: 64,
          markdownPath: 'functions/Button.md',
          packagePath: '@arctura/docs/markdown/functions/Button.md',
        },
        {
          name: 'ButtonProps',
          role: 'props',
          kind: 2097152,
          markdownPath: 'type-aliases/ButtonProps.md',
          packagePath: '@arctura/docs/markdown/type-aliases/ButtonProps.md',
        },
      ]);
    });

    it('deduplicates repeated markdown file matches', () => {
      const files = getComponentMarkdownFiles(docsFixture, 'Button');

      expect(files.filter((file) => file.markdownPath === 'functions/Button.md')).toHaveLength(1);
    });

    it('returns namespace, component, and props markdown files for variable components', () => {
      expect(getComponentMarkdownFiles(docsFixture, 'TextInput')).toMatchObject([
        {
          name: 'TextInput',
          role: 'namespace',
          kind: 4,
          markdownPath: 'Arctura-Atomics-Components/namespaces/TextInput/README.md',
          packagePath:
            '@arctura/docs/markdown/Arctura-Atomics-Components/namespaces/TextInput/README.md',
        },
        {
          name: 'TextInput',
          role: 'component',
          kind: 32,
          markdownPath: 'variables/TextInput.md',
          packagePath: '@arctura/docs/markdown/variables/TextInput.md',
        },
        {
          name: 'TextInputProps',
          role: 'props',
          kind: 256,
          markdownPath: 'interfaces/TextInputProps.md',
          packagePath: '@arctura/docs/markdown/interfaces/TextInputProps.md',
        },
      ]);
    });

    it('supports custom props and package names', () => {
      expect(
        getComponentMarkdownFiles(docsFixture, 'Button', {
          packageName: '@scope/custom-docs',
          propsName: 'ButtonProps',
        })[0]?.packagePath
      ).toBe('@scope/custom-docs/markdown/functions/Button.md');
    });

    it('returns an empty list when no markdown-backed reflections are found', () => {
      expect(getComponentMarkdownFiles(docsFixture, 'MissingComponent')).toEqual([]);
    });

    it('filters reflections without supported markdown output', () => {
      expect(getComponentMarkdownFiles(docsFixture, 'UnknownKind')).toEqual([]);
      expect(getComponentMarkdownFiles(docsFixture, 'NoKind')).toEqual([]);
    });

    it('formats namespace markdown paths without a project segment when the docs name is missing', () => {
      const files = getComponentMarkdownFiles(
        {
          children: [
            {
              name: 'LooseNamespace',
              kind: 4,
            },
          ],
        },
        'LooseNamespace'
      );

      expect(files[0]?.markdownPath).toBe('namespaces/LooseNamespace/README.md');
    });
  });
});
