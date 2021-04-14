import type { Plugin } from 'esbuild';

import type { Option } from './normalize-option';

import { normalizeOptions } from './normalize-option';

export function esbuildIgnorePlugin(options: Option[] = []): Plugin {
  const patterns = normalizeOptions(options);

  return {
    name: 'ignore',
    setup(build) {
      build.onResolve({ filter: /.*/, namespace: 'ignore' }, ({ path }) => ({
        path,
        namespace: 'ignoere',
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
  };
}
