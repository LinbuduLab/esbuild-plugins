import type { Plugin } from 'esbuild';
import type { Options } from './normalize-options';

import { normalizeOptions } from './normalize-options';
import { collectDepsToExclude } from './find-deps';

export const esbuildNodeExternalsPlugin = (
  options: Partial<Options> = {}
): Plugin => ({
  name: 'node-externals',
  setup(build) {
    const normalizedOptions = normalizeOptions(options);
    const depsToExclude = collectDepsToExclude(normalizedOptions);

    build.onResolve({ namespace: 'file', filter: /.*/ }, ({ path }) => {
      // @penumbra/xxx

      // penumbra/xxx
      const [mainModuleOrScope, subModuleOrMainModule] = path.split('/');

      let moduleName = mainModuleOrScope;

      if (path.startsWith('@')) {
        moduleName = `${mainModuleOrScope}/${subModuleOrMainModule}`;
      }

      if (depsToExclude.includes(moduleName)) {
        return { path, external: true };
      }

      return null;
    });
  },
});
