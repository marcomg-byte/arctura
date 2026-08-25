import { commentText, getBlockTag } from './comments.js';
import { extractPropsFromReflection } from './props.js';
import { findReflection, findReflections } from './reflections.js';
import type {
  ComponentDocs,
  ComponentMarkdownFile,
  ComponentMarkdownFileRole,
  GetComponentDocsOptions,
  GetComponentMarkdownFilesOptions,
  TypeDocReflection,
} from './types.js';

const formatMarkdownSegment = (value?: string) => value?.trim().replace(/\s+/g, '-') ?? '';
const namespaceMarkdownPath = (docs: TypeDocReflection, name: string) => {
  const projectSegment = formatMarkdownSegment(docs.name);

  return `${projectSegment ? `${projectSegment}/` : ''}namespaces/${name}/README.md`;
};

const markdownPathsByKind = new Map<number, (docs: TypeDocReflection, name: string) => string>([
  [4, namespaceMarkdownPath],
  [32, (_, name) => `variables/${name}.md`],
  [64, (_, name) => `functions/${name}.md`],
  [256, (_, name) => `interfaces/${name}.md`],
  [2097152, (_, name) => `type-aliases/${name}.md`],
]);

const toMarkdownFile = (
  docs: TypeDocReflection,
  reflection: TypeDocReflection,
  role: ComponentMarkdownFileRole,
  packageName: string
): ComponentMarkdownFile | undefined => {
  if (!reflection.name || !reflection.kind) return undefined;

  const createPath = markdownPathsByKind.get(reflection.kind);
  if (!createPath) return undefined;

  const markdownPath = createPath(docs, reflection.name);

  return {
    name: reflection.name,
    role,
    kind: reflection.kind,
    markdownPath,
    packagePath: `${packageName}/markdown/${markdownPath}`,
    reflection,
  };
};

/**
 * Extracts high-level component documentation from a TypeDoc JSON tree.
 *
 * By default, the function looks for a props reflection named
 * `${componentName}Props`, but consumers can pass `propsName` when the public
 * prop type uses a different name.
 *
 * @param docs - TypeDoc JSON root reflection.
 * @param componentName - Component reflection name, for example `Button`.
 * @param options - Optional lookup configuration.
 * @returns Component documentation ready to render in an app.
 */
const getComponentDocs = (
  docs: TypeDocReflection,
  componentName: string,
  options: GetComponentDocsOptions = {}
): ComponentDocs => {
  const component = findReflection(docs, componentName);
  const props = findReflection(docs, options.propsName ?? `${componentName}Props`);
  const signatures = component?.signatures ?? [];
  const signature = signatures[0];

  return {
    name: component?.name,
    description: commentText(signature?.comment?.summary ?? component?.comment?.summary),
    example: commentText(getBlockTag(signature, '@example')?.content),
    returns: commentText(getBlockTag(signature, '@returns')?.content),
    propsDescription: commentText(props?.comment?.summary),
    propsType: props?.type,
    props: extractPropsFromReflection(props),
    parameters:
      signature?.parameters?.map((parameter) => ({
        name: parameter.name,
        description: commentText(parameter.comment?.summary),
        type: parameter.type,
      })) ?? [],
    reflection: component,
    propsReflection: props,
    signatures,
  };
};

const getComponentMarkdownFiles = (
  docs: TypeDocReflection,
  componentName: string,
  options: GetComponentMarkdownFilesOptions = {}
): ComponentMarkdownFile[] => {
  const packageName = options.packageName ?? '@arctura/docs';
  const propsName = options.propsName ?? `${componentName}Props`;
  const files = [
    ...findReflections(docs, componentName).map((reflection) =>
      toMarkdownFile(
        docs,
        reflection,
        reflection.kind === 4 ? 'namespace' : 'component',
        packageName
      )
    ),
    ...findReflections(docs, propsName).map((reflection) =>
      toMarkdownFile(docs, reflection, 'props', packageName)
    ),
  ].filter((file): file is ComponentMarkdownFile => Boolean(file));

  return Array.from(
    new Map(files.map((file) => [`${file.role}:${file.markdownPath}`, file])).values()
  );
};

export { getComponentDocs, getComponentMarkdownFiles };
