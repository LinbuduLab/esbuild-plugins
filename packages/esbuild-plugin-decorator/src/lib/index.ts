import fs from 'fs/promises';
import type { Plugin } from 'esbuild';
import { ParsedCommandLine } from 'typescript';

import { findDecorators } from './find-decorator';
import {
  normalizeOption,
  ESBuildPluginDecoratorOptions,
} from './normalize-option';

import { parseTsConfig, tscCompiler } from './tsc-compiler';
import { swcCompiler } from './swc-compiler';

export const esbuildDecoratorPlugin = (
  options: Partial<ESBuildPluginDecoratorOptions> = {}
): Plugin => ({
  name: 'decorator',
  setup(build) {
    const normalizedOptions = normalizeOption(options);

    const {
      tsconfigPath,
      force,
      cwd,
      isNxProject,
      compiler,
    } = normalizedOptions;

    // save parsed ts config
    let parsedTsConfig: ParsedCommandLine | null = null;

    // TODO: .swcrc tsconfig.json swcOptions ...
    build.onLoad({ filter: /\.ts$/ }, async ({ path }) => {
      if (!parsedTsConfig) {
        parsedTsConfig = parseTsConfig(tsconfigPath, options.cwd);
      }

      // TODO: swc options
      const shouldSkipThisPlugin =
        !force &&
        (!parsedTsConfig ||
          !parsedTsConfig.options ||
          !parsedTsConfig.options.emitDecoratorMetadata);

      if (shouldSkipThisPlugin) {
        return;
      }

      const fileContent = await fs.readFile(path, 'utf8');
      // .catch((err) => printDiagnostics({  path, err }));

      const hasDecorator = findDecorators(fileContent);

      if (!hasDecorator) {
        return;
      }

      console.log(`Decorator Compilation by [${compiler}]`);

      const contents =
        compiler === 'tsc'
          ? tscCompiler(fileContent, parsedTsConfig.options).outputText
          : swcCompiler(fileContent).code;

      return { contents };
    });
  },
});
