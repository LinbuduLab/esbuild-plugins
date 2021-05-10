import type { Plugin } from 'esbuild';
import type { Options } from './normalize-options';

import { normalizeOption } from './normalize-options';

import { nodeModuleNameResolver, sys } from 'typescript';
import { escapeNamespace } from './escape-namespace';

const debug = require('debug')('esbuild:alias-path');

const pluginName = 'esbuild:alias-path';

export const esbuildPluginAliasPath = (options: Options = {}): Plugin => {
  const { alias, skip, tsconfigPath, compilerOptions } = normalizeOption(
    options
  );

  if (skip) {
    return {
      name: pluginName,
      setup(build) {},
    };
  }

  const escapedNamespace = escapeNamespace(Object.keys(alias));

  return {
    name: pluginName,
    setup(build) {
      // handle alias replacement
      build.onResolve({ filter: escapedNamespace }, ({ path: fromPath }) => {
        if (!alias[fromPath]) {
          return null;
        }

        return {
          path: alias[fromPath],
        };
      });

      // handle tsconfig paths mapping
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
            compilerOptions,
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
