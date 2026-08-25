import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspaceRoot = path.resolve(docsRoot, '..', '..');
const atomicsSourceRoot = path.join(workspaceRoot, 'packages', 'atomics', 'src');
const docsJsonPath = path.join(docsRoot, 'dist', 'atomics-components.json');
const scriptPath = fileURLToPath(import.meta.url);
const declarationKinds = new Set([
  ts.SyntaxKind.InterfaceDeclaration,
  ts.SyntaxKind.TypeAliasDeclaration,
]);

const toPosixPath = (value) => value.split(path.sep).join('/');

const sourceKey = (filePath, name) =>
  `${toPosixPath(path.relative(workspaceRoot, filePath))}:${name}`;

const isAtomicsSourceFile = (fileName) =>
  toPosixPath(path.resolve(fileName)).startsWith(toPosixPath(atomicsSourceRoot));

const readSourceFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) return readSourceFiles(entryPath);
      if (!/\.(ts|tsx)$/.test(entry.name) || /\.d\.ts$/.test(entry.name)) return [];

      return [entryPath];
    })
  );

  return files.flat();
};

const compilerOptions = {
  allowSyntheticDefaultImports: true,
  esModuleInterop: true,
  jsx: ts.JsxEmit.ReactJSX,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  skipLibCheck: true,
  target: ts.ScriptTarget.ES2023,
};

const tagText = (comment) => {
  if (!comment) return '';
  if (typeof comment === 'string') return comment;

  return comment
    .map((part) => part.text ?? '')
    .join('')
    .trim();
};

const normalizePropertyName = (name) => {
  const bracketMatch = /^\[(.+)\]$/.exec(name);
  const propertyName = bracketMatch?.[1] ?? name;

  return propertyName.split('=')[0]?.trim() ?? '';
};

const jsDocText = (parts) =>
  parts
    ?.map((part) => part.text ?? '')
    .join('')
    .trim() ?? '';

const symbolDescription = (checker, symbol) => jsDocText(symbol.getDocumentationComment(checker));

const symbolDefaultValue = (symbol) =>
  symbol
    .getJsDocTags()
    .find((tag) => tag.name === 'defaultValue')
    ?.text?.map((part) => part.text)
    .join('')
    .trim();

const isNullableType = (type) =>
  Boolean(type.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.Void));

const nonNullableType = (type) => {
  if (!type.isUnion()) return type;

  const types = type.types.filter((unionType) => !isNullableType(unionType));

  return types.length === 1 ? types[0] : type;
};

const hasTypeFlag = (type, flags) => Boolean(type.flags & flags);

const objectRenderableTypeNames = new Set(['Element', 'JSX.Element', 'ReactElement', 'ReactNode']);

const normalizePrimitiveTypeName = (typeName) =>
  typeName
    .replace(/\s*\|\s*undefined/g, '')
    .replace(/\s*\|\s*null/g, '')
    .replace(/^React\./, '')
    .trim();

const matchesTypeName = (typeName, typeNames) =>
  typeNames.has(normalizePrimitiveTypeName(typeName));

const isStringLikeType = (type) =>
  hasTypeFlag(
    type,
    ts.TypeFlags.String | ts.TypeFlags.StringLiteral | ts.TypeFlags.TemplateLiteral
  );

const isNumberLikeType = (type) =>
  hasTypeFlag(type, ts.TypeFlags.Number | ts.TypeFlags.NumberLiteral);

const isBooleanLikeType = (type) =>
  hasTypeFlag(type, ts.TypeFlags.Boolean | ts.TypeFlags.BooleanLiteral);

const typeDeclarations = (type) => [
  ...(type.symbol?.declarations ?? []),
  ...(type.aliasSymbol?.declarations ?? []),
];

const isProjectOwnedType = (type) =>
  typeDeclarations(type).some((declaration) =>
    isAtomicsSourceFile(declaration.getSourceFile().fileName)
  );

const getArrayElementType = (checker, type) => {
  if (!checker.isArrayType(type) && !checker.isTupleType(type)) return undefined;

  return checker.getTypeArguments(type)[0];
};

const mergeProperties = (properties) =>
  Array.from(new Map(properties.map((property) => [property.name, property])).values());

const literalValueFromType = (type) => {
  if (type.isStringLiteral()) return type.value;
  if (type.isNumberLiteral()) return type.value;
  if (type.intrinsicName === 'true') return true;
  if (type.intrinsicName === 'false') return false;

  return undefined;
};

const valuesFromType = (type) => {
  const narrowedType = nonNullableType(type);
  const literalValue = literalValueFromType(narrowedType);

  if (literalValue !== undefined) return [literalValue];
  if (!narrowedType.isUnion()) return [];

  const values = narrowedType.types
    .filter((innerType) => !isNullableType(innerType))
    .map(literalValueFromType);

  if (values.length === 0 || values.some((value) => value === undefined)) return [];

  return values;
};

const primitiveFromType = (checker, type, node, seen = new Set(), depth = 0) => {
  const narrowedType = nonNullableType(type);
  const displayType = checker.typeToString(narrowedType, node, ts.TypeFormatFlags.NoTruncation);

  if (matchesTypeName(displayType, objectRenderableTypeNames)) return 'object';

  if (getArrayElementType(checker, narrowedType)) return 'array';
  if (narrowedType.getCallSignatures().length > 0) return 'function';

  if (narrowedType.isUnionOrIntersection()) {
    const primitives = new Set(
      narrowedType.types
        .filter((innerType) => !isNullableType(innerType))
        .map((innerType) => primitiveFromType(checker, innerType, node, seen, depth + 1))
        .filter((primitive) => primitive !== 'unknown')
    );

    if (primitives.size === 1) return [...primitives][0];
    if (primitives.size > 1) return 'unknown';
  }

  if (isBooleanLikeType(narrowedType)) return 'boolean';
  if (isNumberLikeType(narrowedType)) return 'number';
  if (isStringLikeType(narrowedType)) return 'string';
  if (narrowedType.getProperties().length > 0) return 'object';

  if (collectTypeProperties(checker, narrowedType, node, seen, depth).length > 0) {
    return 'object';
  }

  return 'unknown';
};

const kindFromType = (checker, type, node, seen = new Set(), depth = 0) => {
  const narrowedType = nonNullableType(type);
  const displayType = checker.typeToString(narrowedType, node, ts.TypeFormatFlags.NoTruncation);
  const values = valuesFromType(narrowedType);

  if (matchesTypeName(displayType, objectRenderableTypeNames)) return 'slot';
  if (values.length > 0) return 'enum';

  const primitive = primitiveFromType(checker, narrowedType, node, seen, depth);

  if (primitive === 'array') return 'array';
  if (primitive === 'function') return 'function';
  if (primitive === 'object') return 'object';
  if (['boolean', 'number', 'string'].includes(primitive)) return 'primitive';

  return 'unknown';
};

const typeToDocType = (checker, type, node, seen = new Set(), depth = 0) => {
  const displayType = checker.typeToString(type, node, ts.TypeFormatFlags.NoTruncation);
  const values = valuesFromType(type);
  const docType = {
    type: 'raw',
    name: displayType,
    kind: kindFromType(checker, type, node, new Set(seen), depth),
    primitive: primitiveFromType(checker, type, node, new Set(seen), depth),
  };

  if (values.length > 0) {
    docType.values = values;
  }

  const properties = collectTypeProperties(checker, type, node, seen, depth);

  if (properties.length > 0) {
    docType.properties = properties;
  }

  return docType;
};

const collectTypeProperties = (checker, type, node, seen = new Set(), depth = 0) => {
  if (depth >= 3) return [];

  const narrowedType = nonNullableType(type);
  const arrayElementType = getArrayElementType(checker, narrowedType);

  if (arrayElementType) {
    return collectTypeProperties(checker, arrayElementType, node, seen, depth + 1);
  }

  if (narrowedType.isUnionOrIntersection()) {
    return mergeProperties(
      narrowedType.types.flatMap((innerType) =>
        isNullableType(innerType)
          ? []
          : collectTypeProperties(checker, innerType, node, seen, depth + 1)
      )
    );
  }

  const typeName = checker.typeToString(narrowedType, node, ts.TypeFormatFlags.NoTruncation);
  if (seen.has(typeName) || !isProjectOwnedType(narrowedType)) return [];

  const properties = narrowedType.getProperties();
  if (properties.length === 0) return [];

  seen.add(typeName);

  return properties.map((property) => {
    const propertyType = checker.getTypeOfSymbolAtLocation(property, node);
    const type = typeToDocType(checker, propertyType, node, new Set(seen), depth + 1);

    return {
      name: property.getName(),
      description: symbolDescription(checker, property),
      required: !(property.flags & ts.SymbolFlags.Optional),
      defaultValue: symbolDefaultValue(property),
      kind: type.kind,
      primitive: type.primitive,
      type,
      typeName: type.name,
      values: type.values,
    };
  });
};

const propertyType = (checker, node, name) => {
  const symbol = checker.getSymbolAtLocation(node.name);
  const declaredType = symbol ? checker.getDeclaredTypeOfSymbol(symbol) : undefined;
  const property = declaredType?.getProperty(normalizePropertyName(name));
  const type = property ? checker.getTypeOfSymbolAtLocation(property, node) : undefined;

  if (!type) return undefined;

  return typeToDocType(checker, type, node);
};

const parsePropertyTag = (checker, node, comment, defaults = new Map()) => {
  const match = /^\s*(\[[^\]]+\]|\S+)\s*-?\s*(.*)$/s.exec(tagText(comment));
  if (!match) return undefined;
  const name = normalizePropertyName(match[1]);

  return {
    tag: '@property',
    name: match[1],
    type: propertyType(checker, node, match[1]),
    defaultValue: defaults.get(name),
    content: [
      {
        kind: 'text',
        text: match[2].trim(),
      },
    ],
  };
};

const collectDestructuredDefaults = (sourceFile) => {
  const defaultsByPropsName = new Map();

  const setDefault = (propsName, propName, value) => {
    const defaults = defaultsByPropsName.get(propsName) ?? new Map();

    defaults.set(propName, value);
    defaultsByPropsName.set(propsName, defaults);
  };

  const readBindingPattern = (propsName, bindingPattern) => {
    for (const element of bindingPattern.elements) {
      if (!ts.isBindingElement(element) || !element.initializer) continue;

      const propName =
        element.propertyName?.getText(sourceFile) ?? element.name.getText(sourceFile);

      setDefault(
        propsName,
        propName.replace(/^['"]|['"]$/g, ''),
        element.initializer.getText(sourceFile)
      );
    }
  };

  const propsNameFromVariable = (node) => {
    const type = node.type?.getText(sourceFile);
    const match = type ? /(?:FC|FunctionComponent)<([^>]+)>/.exec(type) : undefined;

    return match?.[1] ?? `${node.name.getText(sourceFile)}Props`;
  };

  const visit = (node) => {
    if (ts.isFunctionDeclaration(node) && node.name) {
      const firstParameter = node.parameters[0];

      if (firstParameter && ts.isObjectBindingPattern(firstParameter.name)) {
        readBindingPattern(`${node.name.text}Props`, firstParameter.name);
      }
    }

    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
    ) {
      const firstParameter = node.initializer.parameters[0];

      if (firstParameter && ts.isObjectBindingPattern(firstParameter.name)) {
        readBindingPattern(propsNameFromVariable(node), firstParameter.name);
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return defaultsByPropsName;
};

const mergeDefaultMaps = (target, source) => {
  for (const [propsName, defaults] of source) {
    const existingDefaults = target.get(propsName) ?? new Map();

    for (const [propName, value] of defaults) {
      existingDefaults.set(propName, value);
    }

    target.set(propsName, existingDefaults);
  }
};

const collectPropertyMetadata = async () => {
  const files = await readSourceFiles(atomicsSourceRoot);
  const program = ts.createProgram(files, compilerOptions);
  const checker = program.getTypeChecker();
  const metadata = new Map();
  const defaultsByPropsName = new Map();

  for (const filePath of files) {
    const sourceFile = program.getSourceFile(filePath);
    if (!sourceFile) continue;

    mergeDefaultMaps(defaultsByPropsName, collectDestructuredDefaults(sourceFile));
  }

  for (const filePath of files) {
    const sourceFile = program.getSourceFile(filePath);
    if (!sourceFile) continue;

    const visit = (node) => {
      if (declarationKinds.has(node.kind) && node.name) {
        const defaults = defaultsByPropsName.get(node.name.text) ?? new Map();
        const tags =
          ts
            .getJSDocTags(node)
            .filter((tag) => ['property', 'prop'].includes(tag.tagName.getText(sourceFile)))
            .map((tag) => parsePropertyTag(checker, node, tag.comment, defaults))
            .filter(Boolean) ?? [];

        if (tags.length > 0 || defaults.size > 0) {
          metadata.set(sourceKey(filePath, node.name.text), {
            defaults,
            tags,
          });
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
  }

  return metadata;
};

const enrichReflection = (reflection, metadata) => {
  const source = reflection.sources?.[0];
  const key = source?.fileName ? `${source.fileName}:${reflection.name}` : undefined;
  const reflectionMetadata = key ? metadata.get(key) : undefined;
  const tags = reflectionMetadata?.tags;

  if (tags?.length) {
    reflection.comment ??= {};
    const existingTags = reflection.comment.blockTags ?? [];
    const existingPropertyNames = new Set(
      existingTags.filter((tag) => ['@property', '@prop'].includes(tag.tag)).map((tag) => tag.name)
    );

    reflection.comment.blockTags = [
      ...existingTags,
      ...tags.filter((tag) => !existingPropertyNames.has(tag.name)),
    ];
  }

  for (const child of reflection.children ?? []) {
    child.defaultValue ??= reflectionMetadata?.defaults?.get(child.name);
    enrichReflection(child, metadata);
  }

  for (const signature of reflection.signatures ?? []) enrichReflection(signature, metadata);
  for (const parameter of reflection.parameters ?? []) enrichReflection(parameter, metadata);
  if (reflection.type?.declaration) enrichReflection(reflection.type.declaration, metadata);
};

const enrichTypedocProperties = async () => {
  const docs = JSON.parse(await readFile(docsJsonPath, 'utf8'));
  const metadata = await collectPropertyMetadata();

  enrichReflection(docs, metadata);

  await writeFile(docsJsonPath, `${JSON.stringify(docs, null, '\t')}\n`);
};

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  await enrichTypedocProperties();
}

export { docsJsonPath, enrichTypedocProperties };
