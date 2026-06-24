import type { TypeDocCommentPart, TypeDocReflection } from './types.js';

const commentText = (parts?: TypeDocCommentPart[]) =>
  parts
    ?.map((part) => part.text ?? '')
    .join('')
    .trim() ?? '';

const getBlockTag = (reflection: TypeDocReflection | undefined, tag: string) =>
  reflection?.comment?.blockTags?.find((blockTag) => blockTag.tag === tag);

export { commentText, getBlockTag };
