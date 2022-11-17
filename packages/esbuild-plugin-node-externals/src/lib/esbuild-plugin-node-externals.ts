import { normalizeOptions } from './normalize-options';
import { collectDepsToExclude } from './find-deps';

import type { Plugin } from 'esbuild';
import type { NodeExternalsOptions } from './normalize-options';

export const nodeExternals = (
  options: Partial<NodeExternalsOptions> = {}
): Plugin => ({
  name: 'plugin:node-externals',
  setup(build) {
    const normalizedOptions = normalizeOptions(options);
    const depsToExclude = collectDepsToExclude(normalizedOptions);

    build.onResolve({ namespace: 'file', filter: /.*/ }, ({ path }) => {
      if (normalizedOptions.include.includes(path)) {
        return null;
      }

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
