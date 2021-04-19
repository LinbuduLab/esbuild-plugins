// TODO: As esbuild-plugin-alias-path
import type { Plugin } from 'esbuild';

export interface AliasPathPlugin {
  // alias
  aliases?: Record<string, string>;
  // tsconfig-paths
  paths?: Record<string, string>;
}

// TODO: tsconfig-paths intergration
const esbuildAliasPathPlugin = (options: AliasPathPlugin): Plugin => {
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
      build.onResolve({ filter: escapedNamespace }, (args) => ({
        // if no matched...
        path: aliases[args.path] ?? args.path,
      }));
    },
  };
};

export default esbuildAliasPathPlugin;
