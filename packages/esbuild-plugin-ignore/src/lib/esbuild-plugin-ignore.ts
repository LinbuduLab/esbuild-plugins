import type { Plugin } from 'esbuild';
import type { ESBuildPluginIgnoreOption } from './normalize-option';

import { normalizeOptions } from './normalize-option';

export const esbuildPluginIgnore = (
  options: ESBuildPluginIgnoreOption[] = []
): Plugin => ({
  name: 'ignore',
  setup(build) {
    const patterns = normalizeOptions(options);

    build.onResolve({ filter: /.*/, namespace: 'ignore' }, ({ path }) => ({
      path,
      namespace: 'ignore',
    }));

    for (const pattern of patterns) {
      build.onResolve(
        { filter: pattern.resourceRegExp },
        ({ path, resolveDir }) => {
          return resolveDir.match(pattern.contextRegExp)
            ? {
                path,
                namespace: 'ignore',
              }
            : {
                path,
              };
        }
      );
    }

    build.onLoad({ filter: /.*/, namespace: 'ignore' }, () => ({
      contents: '',
    }));
  },
});
