type TypeDocCommentPart = {
  kind?: string;
  text?: string;
};

type TypeDocBlockTag = {
  tag: string;
  content?: TypeDocCommentPart[];
};

type TypeDocComment = {
  summary?: TypeDocCommentPart[];
  blockTags?: TypeDocBlockTag[];
};

type TypeDocType = {
  type?: string;
  name?: string;
  types?: TypeDocType[];
  target?: unknown;
  declaration?: TypeDocReflection;
  qualifiedName?: string;
  package?: string;
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

type ComponentDocs = {
  name?: string;
  description: string;
  example: string;
  returns: string;
  propsDescription: string;
  propsType?: TypeDocType;
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
  ComponentDocsParameter,
  GetComponentDocsOptions,
  GetComponentMarkdownFilesOptions,
  TypeDocBlockTag,
  TypeDocComment,
  TypeDocCommentPart,
  TypeDocReflection,
  TypeDocSource,
  TypeDocType,
};
