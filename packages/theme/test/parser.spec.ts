import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildCssFile,
  colorRefToCssVar,
  formatGeneratedCss,
  generateTheme,
  getOutputFilePathFromArgs,
  getTokensFilePathFromArgs,
  type Tokens,
} from '@/src/parser';

const mkdirMock = vi.hoisted(() => vi.fn());
const writeFileMock = vi.hoisted(() => vi.fn());

vi.mock('node:fs/promises', () => ({
  default: {
    mkdir: mkdirMock,
    writeFile: writeFileMock,
  },
  mkdir: mkdirMock,
  writeFile: writeFileMock,
}));

const tokens: Tokens = {
  colors: {
    aurora: {
      '500': '#3B82F6',
      '700': '#1d4ed8',
    },
    black: '#000000',
    white: '#ffffff',
  },
  theme: {
    borderWidth: {
      '1': '1px',
    },
    breakpoints: {
      sm: '40rem',
    },
    colors: {
      palette: {
        light: {
          background: {
            primary: 'colors.aurora.500',
            container: 'colors.white',
          },
          text: {
            primary: 'colors.black',
          },
          border: {
            primary: 'colors.aurora.700',
          },
          custom: {
            accent: 'colors.aurora.500',
          },
        },
        dark: {
          background: {
            primary: 'colors.black',
            container: 'colors.aurora.700',
          },
          text: {
            primary: 'colors.white',
          },
          border: {
            primary: 'colors.aurora.500',
          },
          custom: {
            accent: 'colors.white',
          },
        },
      },
    },
    spacing: {
      'space-unit': '8px',
      sm: 1.5,
    },
    typography: {
      fontSize: {
        sm: '0.875rem',
      },
    },
  },
};

beforeEach(() => {
  mkdirMock.mockReset();
  writeFileMock.mockReset();
});

describe('parser', () => {
  describe('getTokensFilePathFromArgs', () => {
    it('defaults to a tokens.json file in the current working directory', () => {
      expect(getTokensFilePathFromArgs([])).toBe('./tokens.json');
    });

    it('uses the tokens file path provided through the short flag', () => {
      expect(getTokensFilePathFromArgs(['-t', './custom-tokens.json'])).toBe(
        './custom-tokens.json'
      );
    });

    it('uses the tokens file path provided through the long flag', () => {
      expect(getTokensFilePathFromArgs(['--tokens', './custom-tokens.json'])).toBe(
        './custom-tokens.json'
      );
    });

    it('throws when the tokens flag is missing its value', () => {
      expect(() => getTokensFilePathFromArgs(['--tokens'])).toThrow(
        'Invalid value: undefined, provived to the argument: --tokens'
      );
      expect(() => getTokensFilePathFromArgs(['-t', '--other'])).toThrow(
        'Invalid value: --other, provived to the argument: -t'
      );
    });
  });

  describe('getOutputFilePathFromArgs', () => {
    it('defaults to a theme.css file in the current working directory', () => {
      expect(getOutputFilePathFromArgs([])).toBe('./theme.css');
    });

    it('uses the output file path provided through the short flag', () => {
      expect(getOutputFilePathFromArgs(['-o', './dist/theme.css'])).toBe('./dist/theme.css');
    });

    it('uses the output file path provided through the long flag', () => {
      expect(getOutputFilePathFromArgs(['--output', './dist/theme.css'])).toBe('./dist/theme.css');
    });

    it('throws when the output flag is missing its value', () => {
      expect(() => getOutputFilePathFromArgs(['--output'])).toThrow(
        'Invalid value: undefined, provived to the argument: --output'
      );
      expect(() => getOutputFilePathFromArgs(['-o', '--other'])).toThrow(
        'Invalid value: --other, provived to the argument: -o'
      );
    });
  });

  describe('colorRefToCssVar', () => {
    it('converts scaled and single-value color references to CSS variables', () => {
      expect(colorRefToCssVar('colors.aurora.500')).toBe('var(--color-aurora-500)');
      expect(colorRefToCssVar('colors.white')).toBe('var(--color-white)');
    });

    it('throws a typed error for unsupported color references', () => {
      expect(() => colorRefToCssVar('theme.colors.primary')).toThrow(
        'Invalid color reference: theme.colors.primary'
      );

      try {
        colorRefToCssVar('theme.colors.primary');
      } catch (error) {
        expect(error).toMatchObject({
          name: 'ColorTokenParsingError',
          colorRef: 'theme.colors.primary',
          message: 'Invalid color reference: theme.colors.primary',
        });
      }
    });
  });

  describe('generateTheme', () => {
    it('generates base, semantic, Tailwind inline, and theme selector CSS', () => {
      const css = generateTheme(tokens);

      expect(css).toContain('--color-aurora-500: 59 130 246');
      expect(css).toContain('--color-black: 0 0 0');
      expect(css).toContain('--space-unit: 8px');
      expect(css).toContain('--font-size-sm: 0.875rem');

      expect(css).toContain('--background-primary: rgb(var(--color-aurora-500))');
      expect(css).toContain('--text-primary: rgb(var(--color-black))');
      expect(css).toContain('--border-primary: rgb(var(--color-aurora-700))');
      expect(css).toContain('--custom-accent: rgb(var(--color-aurora-500))');

      expect(css).toContain('@theme inline');
      expect(css).toContain('--background-color-primary: var(--background-primary)');
      expect(css).toContain('--text-color-primary: var(--text-primary)');
      expect(css).toContain('--border-color-primary: var(--border-primary)');
      expect(css).toContain('--color-custom-accent: var(--custom-accent)');
      expect(css).toContain('--spacing: 8px');
      expect(css).toContain('--spacing-sm: 12px');
      expect(css).toContain('--border-width-1: 1px');
      expect(css).toContain('--breakpoint-sm: 40rem');
      expect(css).toContain('--font-size-sm: var(--font-size-sm)');

      expect(css).toContain('[data-theme="light"]');
      expect(css).toContain('[data-theme="dark"]');
      expect(css).toContain('--background-container: rgb(var(--color-aurora-700))');
    });
  });

  describe('formatGeneratedCss', () => {
    it('normalizes dangling semicolons in generated CSS', () => {
      expect(formatGeneratedCss(':root {\n  --space-unit: 8px\n  ;\n}')).toBe(
        ':root {\n  --space-unit: 8px;\n}'
      );
    });
  });

  describe('buildCssFile', () => {
    it('creates the theme stylesheet directory and writes formatted CSS', async () => {
      await buildCssFile(':root {\n  --space-unit: 8px\n  ;\n}');

      expect(mkdirMock).toHaveBeenCalledOnce();
      expect(mkdirMock).toHaveBeenCalledWith('.', { recursive: true });
      expect(writeFileMock).toHaveBeenCalledOnce();
      expect(writeFileMock).toHaveBeenCalledWith(
        './theme.css',
        ':root {\n    --space-unit: 8px;\n}\n',
        'utf8'
      );
    });

    it('writes formatted CSS to the provided output path', async () => {
      await buildCssFile(':root {\n  --space-unit: 8px\n  ;\n}', './dist/theme.css');

      expect(mkdirMock).toHaveBeenCalledOnce();
      expect(mkdirMock).toHaveBeenCalledWith('./dist', { recursive: true });
      expect(writeFileMock).toHaveBeenCalledOnce();
      expect(writeFileMock).toHaveBeenCalledWith(
        './dist/theme.css',
        ':root {\n    --space-unit: 8px;\n}\n',
        'utf8'
      );
    });
  });
});
