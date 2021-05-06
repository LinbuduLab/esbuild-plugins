import type { Plugin } from 'esbuild';
import type { ESBuildPluginGraphqlOptions } from './normalize-option';

import { normalizePluginOptions } from './normalize-option';

export function esbuildPluginGraphql(
  options: ESBuildPluginGraphqlOptions = {}
): Plugin {
  const normalizeOptions = normalizePluginOptions(options);

  return {
    name: 'esbuild:graphql',
    setup(build) {
      build.onResolve({ filter: new RegExp('') }, (args) => {
        return { ...args };
      });

      build.onLoad({ filter: new RegExp('') }, (args) => {
        return { ...args };
      });
    },
  };
}
