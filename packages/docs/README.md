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
import { getComponentDocs, getComponentMarkdownFiles, getComponentProps } from '@arctura/docs';

const buttonDocs = getComponentDocs(docs, 'Button');
const buttonProps = buttonDocs.props;
const textInputProps = getComponentProps(docs, 'TextInput');
const buttonMarkdownFiles = getComponentMarkdownFiles(docs, 'Button');
```

- `findReflection(docs, name)` finds any reflection by name.
- `findReflections(docs, name)` finds every reflection with the same name.
- `getComponentDocs(docs, componentName)` extracts the component description, example, return text, parameters, props reflection, and normalized props.
- `getComponentProps(docs, componentName)` returns the normalized prop list for a component, including `defaultValue`, runtime `primitive`, control-friendly `kind`, enum `values`, `type`, display-ready `typeName`, and nested `type.properties` for object/interface props.
- `getComponentMarkdownFiles(docs, componentName)` returns the shipped Markdown files related to the component.

`primitive` describes the runtime value family, while `kind` describes the best UI/control treatment. For example, `href` is `{ primitive: 'string', kind: 'primitive' }`, while `variant` is `{ primitive: 'string', kind: 'enum', values: ['primary', 'secondary', 'outline', 'text'] }`.
