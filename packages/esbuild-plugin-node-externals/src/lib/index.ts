import type { Plugin } from 'esbuild';
import { collectDepsToExclude } from './find-deps';
import { normalizeOptions, Options } from './parse-option';

export const esbuildPluginNodeExternals = (
  options: Partial<Options> = {}
): Plugin => ({
  name: 'node-externals',
  setup(build) {
    const normalizedOptions = normalizeOptions(options);
    const depsToExclude = collectDepsToExclude(normalizedOptions);
    // console.log(
    //   '[esbuild-plugin-node-externals] depsToExclude: ',
    //   depsToExclude
    // );

    build.onResolve({ namespace: 'file', filter: /.*/ }, ({ path }) => {
      const [mainModuleOrScope, subModuleOrMainModule] = path.split('/');

      let moduleName = mainModuleOrScope;

      if (path.startsWith('@')) {
        moduleName = `${mainModuleOrScope}/${subModuleOrMainModule}`;
      }

      if (depsToExclude.includes(moduleName)) {
        return { path: path, external: true };
      }

      return null;
    });
  },
});
