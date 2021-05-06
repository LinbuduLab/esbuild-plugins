import type { Plugin } from 'esbuild';
import type { ESBuildPluginAliasPathOptions } from './normalize-options';

import { normalizeOption } from './normalize-options';

import { nodeModuleNameResolver, sys, CompilerOptions } from 'typescript';
import { loadCompilerOptions } from './load-compiler-options';
import { escapeNamespace } from './escape-namespace';
import merge from 'lodash/merge';

const debug = require('debug')('esbuild:alias-path');

export const esbuildPluginAliasPath = (
  options: ESBuildPluginAliasPathOptions = {}
): Plugin => {
  const { alias, paths, baseUrl, tsconfigPath } = normalizeOption(options);

  const escapedNamespace = escapeNamespace(Object.keys(alias));

  const compilerOptions: CompilerOptions = merge(
    loadCompilerOptions(tsconfigPath),
    baseUrl,
    paths
  );

  return {
    name: 'alias-path',
    setup(build) {
      build.onResolve({ filter: escapedNamespace }, ({ path: filePath }) => {
        if (!alias[filePath]) {
          return null;
        }

        return {
          path: alias[filePath],
        };
      });

      build.onResolve(
        { filter: /.*/ },
        async ({ path: filePath, importer }) => {
          if (!compilerOptions.paths) {
            return null;
          }

          const hasMatchingPath = Object.keys(
            compilerOptions.paths
          ).some((path) =>
            new RegExp(path.replace('*', '\\w*')).test(filePath)
          );

          if (!hasMatchingPath) {
            return null;
          }

          const { resolvedModule } = nodeModuleNameResolver(
            filePath,
            importer,
            compilerOptions || {},
            sys
          );

          const { resolvedFileName } = resolvedModule;

          if (!resolvedFileName || resolvedFileName.endsWith('.d.ts')) {
            return null;
          }

          const resolved = sys.resolvePath(resolvedFileName);

          return {
            path: resolved,
          };
        }
      );
    },
  };
};
