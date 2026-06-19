import { readFileSync } from 'node:fs';
import { builtinModules } from 'node:module';
import { resolve } from 'node:path';
import type { PluginOption, UserConfig } from 'vite';

type PackageJson = {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

type LibraryConfigOptions = {
  packageRoot: string;
  entry: Record<string, string>;
  aliases?: NonNullable<UserConfig['resolve']>['alias'];
  external?: string[];
  plugins?: PluginOption[];
};

const nodeBuiltins = builtinModules.flatMap((moduleName) => [moduleName, `node:${moduleName}`]);

function readPackageJson(packageRoot: string): PackageJson {
  const packageJsonPath = resolve(packageRoot, 'package.json');
  return JSON.parse(readFileSync(packageJsonPath, 'utf8')) as PackageJson;
}

function getPackageExternals(packageRoot: string, external: string[] = []): string[] {
  const packageJson = readPackageJson(packageRoot);
  const dependencies = Object.keys(packageJson.dependencies ?? {});
  const peerDependencies = Object.keys(packageJson.peerDependencies ?? {});

  return [...new Set([...dependencies, ...peerDependencies, ...nodeBuiltins, ...external])];
}

function makeLibraryConfig({
  packageRoot,
  entry,
  aliases,
  external,
  plugins,
}: LibraryConfigOptions) {
  return {
    resolve: {
      alias: aliases,
    },
    build: {
      lib: {
        entry,
        formats: ['es', 'cjs'],
        fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
      },
      rollupOptions: {
        external: getPackageExternals(packageRoot, external),
      },
    },
    plugins,
  } satisfies UserConfig;
}

export { makeLibraryConfig };
