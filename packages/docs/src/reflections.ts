import type { TypeDocReflection } from './types.js';

/**
 * Finds the first TypeDoc reflection matching the provided name.
 *
 * @param node - Root TypeDoc reflection or any nested reflection node.
 * @param name - Reflection name to find.
 * @returns The matching reflection, or `undefined` when no match exists.
 */
const findReflection = (
  node: TypeDocReflection | undefined,
  name: string
): TypeDocReflection | undefined => {
  if (!node) return undefined;
  if (node.name === name) return node;

  for (const child of node.children ?? []) {
    const found = findReflection(child, name);
    if (found) return found;
  }

  for (const signature of node.signatures ?? []) {
    const found = findReflection(signature, name);
    if (found) return found;
  }

  for (const parameter of node.parameters ?? []) {
    const found = findReflection(parameter, name);
    if (found) return found;
  }

  if (node.type?.declaration) {
    return findReflection(node.type.declaration, name);
  }

  return undefined;
};

const findReflections = (
  node: TypeDocReflection | undefined,
  name: string,
  matches: TypeDocReflection[] = []
): TypeDocReflection[] => {
  if (!node) return matches;

  if (node.name === name) {
    matches.push(node);
  }

  for (const child of node.children ?? []) {
    findReflections(child, name, matches);
  }

  for (const signature of node.signatures ?? []) {
    findReflections(signature, name, matches);
  }

  for (const parameter of node.parameters ?? []) {
    findReflections(parameter, name, matches);
  }

  if (node.type?.declaration) {
    findReflections(node.type.declaration, name, matches);
  }

  return matches;
};

export { findReflection, findReflections };
