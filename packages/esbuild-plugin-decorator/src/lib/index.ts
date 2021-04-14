import fs from 'fs/promises';
import path from 'path';
import type { Plugin } from 'esbuild';
import { transpileModule, ParsedCommandLine } from 'typescript';

import { parseTsConfig } from './parse-config';
import { findDecorators } from './find-decorator';

export type ESBuildPluginDecoratorOptions = {
  tsconfigPath?: string;
  forceTsc?: boolean;
  cwd?: string;
};

export const esbuildDecoratorPlugin = (
  options: ESBuildPluginDecoratorOptions
): Plugin => ({
  name: 'decorator',
  setup(build) {
    const tsconfigPath =
      // FIXME: load tsconfig.base.json in Nx project, in common proejct load tsconfig.json
      options.tsconfigPath ?? path.join(process.cwd(), './tsconfig.base.json');
    const forceTsc = options.forceTsc ?? false;

    let parsedTsConfig: ParsedCommandLine | null = null;

    build.onLoad({ filter: /\.ts$/ }, async ({ path }) => {
      if (!parsedTsConfig) {
        parsedTsConfig = parseTsConfig(tsconfigPath, options.cwd);
        // TODO: source map related
        // if (parsedTsConfig.sourcemap) {
        //   parsedTsConfig.sourcemap = false;
        //   parsedTsConfig.inlineSources = true;
        //   parsedTsConfig.inlineSourceMap = true;
        // }
      }

      const shouldSkipThisPlugin =
        !forceTsc &&
        (!parsedTsConfig ||
          !parsedTsConfig.options ||
          !parsedTsConfig.options.emitDecoratorMetadata);

      if (shouldSkipThisPlugin) {
        return;
      }

      const ts = await fs.readFile(path, 'utf8');
      // .catch((err) => printDiagnostics({  path, err }));

      const hasDecorator = findDecorators(ts);
      if (!hasDecorator) {
        return;
      }

      const program = transpileModule(ts, {
        compilerOptions: parsedTsConfig.options,
      });
      return { contents: program.outputText };
    });
  },
});
