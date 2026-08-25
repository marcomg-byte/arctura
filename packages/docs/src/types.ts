type TypeDocCommentPart = {
  kind?: string;
  text?: string;
};

type TypeDocBlockTag = {
  tag: string;
  name?: string;
  defaultValue?: string;
  type?: TypeDocType;
  content?: TypeDocCommentPart[];
};

type TypeDocComment = {
  summary?: TypeDocCommentPart[];
  blockTags?: TypeDocBlockTag[];
};

type TypeDocType = {
  type?: string;
  name?: string;
  kind?: string;
  primitive?: string;
  properties?: TypeDocProperty[];
  value?: unknown;
  values?: unknown[];
  types?: TypeDocType[];
  typeArguments?: TypeDocType[];
  target?: unknown;
  declaration?: TypeDocReflection;
  qualifiedName?: string;
  package?: string;
};

type TypeDocProperty = {
  name?: string;
  description?: string;
  required?: boolean;
  defaultValue?: string;
  kind?: string;
  primitive?: string;
  type?: TypeDocType;
  typeName?: string;
  values?: unknown[];
  reflection?: TypeDocReflection;
};

type TypeDocSource = {
  fileName?: string;
  line?: number;
  character?: number;
  url?: string;
};

type TypeDocReflection = {
  id?: number;
  name?: string;
  kind?: number;
  kindString?: string;
  comment?: TypeDocComment;
  children?: TypeDocReflection[];
  signatures?: TypeDocReflection[];
  parameters?: TypeDocReflection[];
  type?: TypeDocType;
  defaultValue?: string;
  flags?: {
    isOptional?: boolean;
    [key: string]: unknown;
  };
  sources?: TypeDocSource[];
};

type ComponentDocsParameter = {
  name?: string;
  description: string;
  type?: TypeDocType;
};

type ComponentDocsPrimitive =
  | 'array'
  | 'boolean'
  | 'function'
  | 'number'
  | 'object'
  | 'string'
  | 'unknown';

type ComponentDocsKind =
  | 'array'
  | 'enum'
  | 'function'
  | 'object'
  | 'primitive'
  | 'slot'
  | 'unknown';

type ComponentDocsValue = boolean | number | string;

type ComponentDocsType = Omit<
  TypeDocType,
  'kind' | 'primitive' | 'properties' | 'types' | 'typeArguments' | 'values'
> & {
  kind?: ComponentDocsKind;
  primitive?: ComponentDocsPrimitive;
  properties?: ComponentDocsProp[];
  types?: ComponentDocsType[];
  typeArguments?: ComponentDocsType[];
  values?: ComponentDocsValue[];
};

type ComponentDocsProp = {
  name: string;
  description: string;
  required: boolean;
  defaultValue?: string;
  kind: ComponentDocsKind;
  primitive: ComponentDocsPrimitive;
  type?: ComponentDocsType;
  typeName: string;
  values?: ComponentDocsValue[];
  reflection?: TypeDocReflection;
};

type ComponentDocs = {
  name?: string;
  description: string;
  example: string;
  returns: string;
  propsDescription: string;
  propsType?: TypeDocType;
  props: ComponentDocsProp[];
  parameters: ComponentDocsParameter[];
  reflection?: TypeDocReflection;
  propsReflection?: TypeDocReflection;
  signatures: TypeDocReflection[];
};

type GetComponentDocsOptions = {
  propsName?: string;
};

type ComponentMarkdownFileRole = 'component' | 'namespace' | 'props';

type ComponentMarkdownFile = {
  name: string;
  role: ComponentMarkdownFileRole;
  kind: number;
  markdownPath: string;
  packagePath: string;
  reflection: TypeDocReflection;
};

type GetComponentMarkdownFilesOptions = GetComponentDocsOptions & {
  packageName?: string;
};

export type {
  ComponentDocs,
  ComponentMarkdownFile,
  ComponentMarkdownFileRole,
  ComponentDocsKind,
  ComponentDocsParameter,
  ComponentDocsPrimitive,
  ComponentDocsProp,
  ComponentDocsType,
  ComponentDocsValue,
  GetComponentDocsOptions,
  GetComponentMarkdownFilesOptions,
  TypeDocBlockTag,
  TypeDocComment,
  TypeDocCommentPart,
  TypeDocReflection,
  TypeDocProperty,
  TypeDocSource,
  TypeDocType,
};
