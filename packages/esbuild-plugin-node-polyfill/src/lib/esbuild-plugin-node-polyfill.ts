import type { Plugin } from 'esbuild';
import type { ESBuildPluginNodePolyfillOptions } from './normalize-option';

import { normalizePluginOptions } from './normalize-option';

export function esbuildPluginNodePolyfill(
  options: ESBuildPluginNodePolyfillOptions = {}
): Plugin {
  const normalizeOptions = normalizePluginOptions(options);

  return {
    name: 'esbuild:node-polyfill',
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
