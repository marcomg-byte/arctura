# @arctura/theme

Theme token utilities, CSS generation, and a client-side hook for switching themes.

## Install

```bash
yarn add @arctura/theme
```

## Exports

```tsx
import { useTheme } from '@arctura/theme';
import { colorRefToCssVar, generateTheme } from '@arctura/theme/parser';
```

## What It Does

- Reads a design-token JSON file.
- Generates CSS custom properties for base colors, spacing, border widths, breakpoints, and typography.
- Emits semantic theme variables for light and dark modes.
- Writes a ready-to-use stylesheet such as `theme.css`.

## CLI

The package exposes a CLI binary named `arctura-theme`.

```bash
yarn theme:parse
```

Or run it directly with explicit input and output paths:

```bash
arctura-theme --tokens ./tokens.json --output ./theme.css
```

Short flags are also supported:

- `-t` or `--tokens`
- `-o` or `--output`

If no arguments are provided, the CLI defaults to:

- `./tokens.json` for input
- `./theme.css` for output

## Token Shape

The parser expects a root object with at least:

- `colors`: base color families and scale values
- `theme.colors.palette.light` and `theme.colors.palette.dark`: semantic color references
- `theme.spacing`: spacing scale with a required `space-unit`
- `theme.borderWidth`: border width tokens
- `theme.breakpoints`: responsive breakpoint tokens
- `theme.typography.fontSize`: optional typography tokens

Example:

```json
{
  "colors": {
    "sky": {
      "500": "#0077ff"
    },
    "white": "#ffffff"
  },
  "theme": {
    "colors": {
      "palette": {
        "light": {
          "background": {
            "primary": "colors.white"
          },
          "text": {
            "primary": "colors.sky.500"
          }
        },
        "dark": {
          "background": {
            "primary": "colors.sky.500"
          },
          "text": {
            "primary": "colors.white"
          }
        }
      }
    },
    "spacing": {
      "space-unit": "8px",
      "sm": 1.5
    },
    "borderWidth": {
      "1": "1px"
    },
    "breakpoints": {
      "sm": "40rem"
    },
    "typography": {
      "fontSize": {
        "sm": "0.875rem"
      }
    }
  }
}
```

## Runtime Hook

`useTheme()` stores the selected theme mode in `localStorage`, mirrors it to `document.documentElement[data-theme]`, and follows the system color scheme when the mode is `system`.

```tsx
import { useTheme } from '@arctura/theme';

function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <button onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
      Current mode: {mode}
    </button>
  );
}
```

## Development

From the repository root:

```bash
yarn workspace @arctura/theme build
yarn workspace @arctura/theme lint
yarn workspace @arctura/theme test
yarn workspace @arctura/theme typecheck
yarn workspace @arctura/theme theme:parse
```
