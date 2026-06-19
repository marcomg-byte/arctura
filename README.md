# arctura

Arctura is a monorepo of React UI components and design-token tooling.

## Packages

- `@arctura/atomics`: reusable React components and shared hooks.
- `@arctura/theme`: theme token parsing, CSS generation, and the `useTheme` hook.

## Requirements

- Node.js `24`
- Yarn `4.11.0`

## Getting Started

```bash
yarn install
yarn build
```

## Useful Scripts

- `yarn build`: build every workspace package.
- `yarn lint`: lint every workspace package.
- `yarn test`: run the repository tests.
- `yarn typecheck`: type-check every workspace package.
- `yarn clean`: remove generated artifacts.

## Package Docs

- [Atomics package](./packages/atomics/README.md)
- [Theme package](./packages/theme/README.md)

## Repository Layout

```text
packages/
  atomics/  React components and hooks
  theme/    Design tokens, theme generation, and theme hooks
```
