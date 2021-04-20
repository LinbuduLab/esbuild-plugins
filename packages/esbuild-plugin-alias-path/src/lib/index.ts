import type { Plugin } from 'esbuild';

export interface Alias {
  from: string | RegExp;
  to: string;
}
export interface AliasPathPlugin {
  // alias
  // {"a":"b"} or [{from:"", to:""}]
  aliases?: Record<string, string> | Alias[];
  // tsconfig-paths
  paths?: Record<string, string>;
  // nx fileReplacements
}

// TODO: tsconfig-paths intergration
export const esbuildAliasPathPlugin = (
  options: AliasPathPlugin = {}
): Plugin => {
  const aliases = options.aliases ?? {};

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
