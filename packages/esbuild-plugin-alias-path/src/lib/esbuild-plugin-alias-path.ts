import type { Plugin } from 'esbuild';
import type { Options } from './normalize-options';

import { normalizeOption } from './normalize-options';

const pluginName = 'esbuild:alias-path';

export function escapeNamespace(keys: string[]) {
  return new RegExp(
    `^${keys
      .map((str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|')}$`
  );
}

export const esbuildPluginAliasPath = (options: Options = {}): Plugin => {
  const { alias, skip } = normalizeOption(options);

  if (skip) {
    return {
      name: pluginName,
      setup() {
        void 0;
      },
    };
  }

  const escapedNamespace = escapeNamespace(Object.keys(alias));

  return {
    name: pluginName,
    setup(build) {
      build.onResolve({ filter: escapedNamespace }, ({ path: fromPath }) => {
        const replacedPath = alias[fromPath];

        if (!replacedPath) {
          return null;
        }

        return {
          path: replacedPath,
        };
      });
    },
  };
};
