# @arctura/docs

Static API documentation for the atomic components exported by `@arctura/atomics`.

## Scripts

- `yarn build` generates TypeDoc JSON and Markdown into `dist`.
- `yarn dev` regenerates TypeDoc output in watch mode.
- `yarn clean` removes generated documentation.

## Outputs

- `dist/atomics-components.json` contains TypeDoc reflection data for app-rendered docs.
- `dist/markdown` contains Markdown generated from the same TypeDoc component API.

## Runtime helpers

The package also exports helpers for reading the generated TypeDoc JSON:

```ts
import docs from '@arctura/docs/atomics-components.json';
import { getComponentDocs, getComponentMarkdownFiles } from '@arctura/docs';

const buttonDocs = getComponentDocs(docs, 'Button');
const buttonMarkdownFiles = getComponentMarkdownFiles(docs, 'Button');
```

- `findReflection(docs, name)` finds any reflection by name.
- `findReflections(docs, name)` finds every reflection with the same name.
- `getComponentDocs(docs, componentName)` extracts the component description, example, return text, parameters, and props reflection.
- `getComponentMarkdownFiles(docs, componentName)` returns the shipped Markdown files related to the component.
