/**
 * An enhanced version of esbuild-plugin-import-glob
 *
 * @link {https://github.com/thomaschaaf/esbuild-plugin-import-glob}
 */

import globby, { GlobbyOptions } from 'globby';
import type { Plugin } from 'esbuild';

export interface GlobImportOptions {
  globbyOptions?: GlobbyOptions;
  debug?: boolean;
  sorter?: (input: string[]) => string[];
}

function generateImportStatements(files: string[]): string {
  return `${files
    .map((module, index) => `import * as module${index} from '${module}'`)
    .join(';')}
        const modules = [${files
          .map((module, index) => `module${index}`)
          .join(',')}];
        export default modules;

        export const filenames = [${files
          .map((module, index) => `'${module}'`)
          .join(',')}]
      `;
}

export const globImport = (options: GlobImportOptions = {}): Plugin => {
  const { globbyOptions = {}, debug = false, sorter } = options;

  return {
    name: 'plugin:glob-import',
    setup({ onResolve, onLoad }) {
      onResolve({ filter: /\*/ }, async (args) => {
        if (args.resolveDir === '') {
          return;
        }

        return {
          path: args.path,
          namespace: 'glob-import',
          pluginData: {
            resolveDir: args.resolveDir,
          },
        };
      });

      onLoad({ filter: /.*/, namespace: 'glob-import' }, async (args) => {
        const globbed = await globby(args.path, {
          cwd: args.pluginData.resolveDir,
          ...globbyOptions,
        });

        const files = sorter ? sorter(globbed) : globbed.sort();

        const importerCode = generateImportStatements(files);

        return {
          contents: importerCode,
          resolveDir: args.pluginData.resolveDir,
        };
      });
    },
  };
};
