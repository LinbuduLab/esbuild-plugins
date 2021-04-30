import type { Plugin } from 'esbuild';
import type { ESBuildPluginAliasPathOptions } from './normalize-options';

import { normalizeOption } from './normalize-options';

// TODO: tsconfig-paths intergration
export const esbuildPluginAliasPath = (
  options: ESBuildPluginAliasPathOptions = {}
): Plugin => {
  const { aliases, paths } = normalizeOption(options);
  const aliasKeys = Object.keys(aliases);

  const escapedNamespace = new RegExp(
    `^${aliasKeys
      .map((str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|')}$`
  );

  return {
    name: 'alias-path',
    setup(build) {
      build.onResolve({ filter: escapedNamespace }, (args) => {
        return {
          // if no matched...
          path: aliases[args.path] ?? args.path,
        };
      });

      if (Array.isArray(aliases)) {
        aliases.forEach((alias) => {
          build.onResolve({ filter: new RegExp(alias.from) }, (args) => {
            return {
              // if no matched...
              path: alias.to ?? args.path,
            };
          });
        });
      }
    },
  };
};
