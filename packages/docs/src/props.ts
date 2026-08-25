import { commentText } from './comments.js';
import { findReflection } from './reflections.js';
import type {
  ComponentDocsKind,
  ComponentDocsPrimitive,
  ComponentDocsProp,
  ComponentDocsType,
  ComponentDocsValue,
  GetComponentDocsOptions,
  TypeDocBlockTag,
  TypeDocProperty,
  TypeDocType,
  TypeDocReflection,
} from './types.js';

const propertyTags = new Set(['@property', '@prop']);

const isPropertyTag = (blockTag: TypeDocBlockTag) => propertyTags.has(blockTag.tag);

const getDefaultValueTag = (reflection: TypeDocReflection | undefined) =>
  reflection?.comment?.blockTags?.find((blockTag) => blockTag.tag === '@defaultValue');

const maybeDefaultValue = (value?: string) => (value ? value : undefined);

const getDefaultValue = (reflection: TypeDocReflection | undefined) =>
  maybeDefaultValue(reflection?.defaultValue) ??
  maybeDefaultValue(commentText(getDefaultValueTag(reflection)?.content));

const formatLiteralType = (value: unknown) => {
  if (typeof value === 'string') return JSON.stringify(value);

  return String(value);
};

const formatType = (type?: TypeDocReflection['type']): string => {
  if (!type) return '';

  if (type.type === 'literal' && 'value' in type) {
    return formatLiteralType(type.value);
  }

  if (type.types?.length) {
    const separator = type.type === 'intersection' ? ' & ' : ' | ';

    return type.types.map(formatType).filter(Boolean).join(separator);
  }

  if (type.typeArguments?.length) {
    return `${type.name ?? ''}<${type.typeArguments.map(formatType).join(', ')}>`;
  }

  return type.name ?? type.qualifiedName ?? type.type ?? '';
};

const nullableTypeNames = new Set(['undefined', 'null', 'void']);
const objectRenderableTypeNames = new Set(['Element', 'JSX.Element', 'ReactElement', 'ReactNode']);
const componentDocsPrimitives = new Set<ComponentDocsPrimitive>([
  'array',
  'boolean',
  'function',
  'number',
  'object',
  'string',
  'unknown',
]);
const componentDocsKinds = new Set<ComponentDocsKind>([
  'array',
  'enum',
  'function',
  'object',
  'primitive',
  'slot',
  'unknown',
]);

const normalizePrimitiveTypeName = (typeName: string) =>
  typeName
    .replace(/\s*\|\s*undefined/g, '')
    .replace(/\s*\|\s*null/g, '')
    .trim();

const isStringLiteralTypeName = (typeName: string) =>
  /^".*"$/.test(typeName) || /^'.*'$/.test(typeName);

const matchesTypeName = (typeName: string, typeNames: Set<string>) => {
  const normalizedTypeName = normalizePrimitiveTypeName(typeName).replace(/^React\./, '');

  return typeNames.has(normalizedTypeName);
};

const isComponentDocsPrimitive = (value: unknown): value is ComponentDocsPrimitive =>
  typeof value === 'string' && componentDocsPrimitives.has(value as ComponentDocsPrimitive);

const isComponentDocsKind = (value: unknown): value is ComponentDocsKind =>
  typeof value === 'string' && componentDocsKinds.has(value as ComponentDocsKind);

const isComponentDocsValue = (value: unknown): value is ComponentDocsValue =>
  ['boolean', 'number', 'string'].includes(typeof value);

const literalValueFromType = (type?: TypeDocType): ComponentDocsValue | undefined => {
  if (type?.type !== 'literal' || !('value' in type)) return undefined;

  return isComponentDocsValue(type.value) ? type.value : undefined;
};

const valuesFromType = (type?: TypeDocType): ComponentDocsValue[] | undefined => {
  const definedValues = type?.values?.filter(isComponentDocsValue);
  if (definedValues?.length) return definedValues;

  const literalValue = literalValueFromType(type);
  if (literalValue !== undefined) return [literalValue];

  if (!type?.types?.length) return undefined;

  const values = type.types
    .filter(
      (innerType) => !nullableTypeNames.has(normalizePrimitiveTypeName(formatType(innerType)))
    )
    .map(literalValueFromType);

  if (values.length === 0 || values.some((value) => value === undefined)) return undefined;

  return values.filter(isComponentDocsValue);
};

const primitiveFromType = (type?: TypeDocType): ComponentDocsPrimitive => {
  if (!type) return 'unknown';

  const currentPrimitive = isComponentDocsPrimitive(type.primitive) ? type.primitive : undefined;
  const typeName = normalizePrimitiveTypeName(formatType(type));

  if (matchesTypeName(typeName, objectRenderableTypeNames)) return 'object';
  if (currentPrimitive && currentPrimitive !== 'unknown') return currentPrimitive;

  if (type.properties?.length) return 'object';

  if (type.type === 'array') return 'array';
  if (type.type === 'reflection') return 'object';

  if (type.type === 'literal') {
    if (typeof type.value === 'string') return 'string';
    if (typeof type.value === 'number') return 'number';
    if (typeof type.value === 'boolean') return 'boolean';
  }

  if (type.types?.length) {
    const primitives = new Set(
      type.types
        .map((innerType) => {
          const typeName = normalizePrimitiveTypeName(formatType(innerType));

          return nullableTypeNames.has(typeName) ? undefined : primitiveFromType(innerType);
        })
        .filter((primitive): primitive is ComponentDocsPrimitive => Boolean(primitive))
    );

    if (primitives.size === 1) return [...primitives][0] ?? 'unknown';
    if (primitives.size === 0) return 'unknown';
  }

  if (isComponentDocsPrimitive(typeName)) return typeName;
  if (typeName.endsWith('[]') || /^Array<.+>$/.test(typeName)) return 'array';
  if (typeName.includes('=>') || typeName.startsWith('(')) return 'function';

  const unionParts = typeName.split(' | ').filter((part) => !nullableTypeNames.has(part));
  if (unionParts.length > 0 && unionParts.every(isStringLiteralTypeName)) return 'string';

  return currentPrimitive ?? 'unknown';
};

const kindFromType = (type?: TypeDocType): ComponentDocsKind => {
  if (!type) return 'unknown';

  const typeName = normalizePrimitiveTypeName(formatType(type));
  if (matchesTypeName(typeName, objectRenderableTypeNames)) return 'slot';

  const values = valuesFromType(type);
  if (values?.length) return 'enum';

  if (isComponentDocsKind(type.kind) && type.kind !== 'unknown') return type.kind;

  const primitive = primitiveFromType(type);
  if (primitive === 'array') return 'array';
  if (primitive === 'function') return 'function';
  if (primitive === 'object') return 'object';
  if (primitive === 'boolean' || primitive === 'number' || primitive === 'string') {
    return 'primitive';
  }

  return 'unknown';
};

const normalizeType = (type?: TypeDocType): ComponentDocsType | undefined => {
  if (!type) return undefined;

  const {
    kind: _kind,
    primitive: _primitive,
    properties,
    types,
    typeArguments,
    values: _values,
    ...rest
  } = type;

  return {
    ...rest,
    kind: kindFromType(type),
    primitive: primitiveFromType(type),
    ...(valuesFromType(type) ? { values: valuesFromType(type) } : {}),
    ...(properties
      ? {
          properties: properties
            .map(propFromTypeProperty)
            .filter((prop): prop is ComponentDocsProp => Boolean(prop)),
        }
      : {}),
    ...(types
      ? {
          types: types
            .map(normalizeType)
            .filter((innerType): innerType is ComponentDocsType => Boolean(innerType)),
        }
      : {}),
    ...(typeArguments
      ? {
          typeArguments: typeArguments
            .map(normalizeType)
            .filter((innerType): innerType is ComponentDocsType => Boolean(innerType)),
        }
      : {}),
  };
};

const normalizePropertyName = (name: string) => {
  const trimmedName = name.trim();
  const bracketMatch = /^\[(.+)\]$/.exec(trimmedName);
  const propertyName = bracketMatch?.[1] ?? trimmedName;

  return propertyName.split('=')[0]?.trim() ?? '';
};

const isRequiredProperty = (name: string) => !name.trim().startsWith('[');

const propFromTypeProperty = (property: TypeDocProperty): ComponentDocsProp | undefined => {
  if (!property.name) return undefined;

  return {
    name: property.name,
    description: property.description ?? '',
    required: property.required ?? false,
    ...(maybeDefaultValue(property.defaultValue)
      ? { defaultValue: maybeDefaultValue(property.defaultValue) }
      : {}),
    kind: isComponentDocsKind(property.kind) ? property.kind : kindFromType(property.type),
    primitive: isComponentDocsPrimitive(property.primitive)
      ? property.primitive
      : primitiveFromType(property.type),
    type: normalizeType(property.type),
    typeName: property.typeName ?? formatType(property.type),
    ...(property.values?.filter(isComponentDocsValue).length
      ? { values: property.values.filter(isComponentDocsValue) }
      : valuesFromType(property.type)
        ? { values: valuesFromType(property.type) }
        : {}),
    ...(property.reflection ? { reflection: property.reflection } : {}),
  };
};

const propFromReflection = (reflection: TypeDocReflection): ComponentDocsProp | undefined => {
  if (!reflection.name) return undefined;

  return {
    name: reflection.name,
    description: commentText(reflection.comment?.summary),
    required: !reflection.flags?.isOptional,
    ...(getDefaultValue(reflection) ? { defaultValue: getDefaultValue(reflection) } : {}),
    kind: kindFromType(reflection.type),
    primitive: primitiveFromType(reflection.type),
    type: normalizeType(reflection.type),
    typeName: formatType(reflection.type),
    ...(valuesFromType(reflection.type) ? { values: valuesFromType(reflection.type) } : {}),
    reflection,
  };
};

const propFromBlockTag = (blockTag: TypeDocBlockTag): ComponentDocsProp | undefined => {
  if (!blockTag.name) return undefined;

  const name = normalizePropertyName(blockTag.name);
  if (!name) return undefined;

  return {
    name,
    description: commentText(blockTag.content),
    required: isRequiredProperty(blockTag.name),
    ...(maybeDefaultValue(blockTag.defaultValue)
      ? { defaultValue: maybeDefaultValue(blockTag.defaultValue) }
      : {}),
    kind: kindFromType(blockTag.type),
    primitive: primitiveFromType(blockTag.type),
    type: normalizeType(blockTag.type),
    typeName: formatType(blockTag.type),
    ...(valuesFromType(blockTag.type) ? { values: valuesFromType(blockTag.type) } : {}),
  };
};

const mergeProps = (props: ComponentDocsProp[]) =>
  Array.from(new Map(props.map((prop) => [prop.name, prop])).values());

const extractPropsFromReflection = (
  propsReflection: TypeDocReflection | undefined
): ComponentDocsProp[] => {
  if (!propsReflection) return [];

  const childProps =
    propsReflection.children
      ?.map(propFromReflection)
      .filter((prop): prop is ComponentDocsProp => Boolean(prop)) ?? [];
  const blockTagProps =
    propsReflection.comment?.blockTags
      ?.filter(isPropertyTag)
      .map(propFromBlockTag)
      .filter((prop): prop is ComponentDocsProp => Boolean(prop)) ?? [];

  return mergeProps([...childProps, ...blockTagProps]);
};

const getComponentProps = (
  docs: TypeDocReflection,
  componentName: string,
  options: GetComponentDocsOptions = {}
): ComponentDocsProp[] => {
  const propsReflection = findReflection(docs, options.propsName ?? `${componentName}Props`);

  return extractPropsFromReflection(propsReflection);
};

export {
  extractPropsFromReflection,
  formatType,
  getComponentProps,
  kindFromType,
  normalizeType,
  primitiveFromType,
  valuesFromType,
};
