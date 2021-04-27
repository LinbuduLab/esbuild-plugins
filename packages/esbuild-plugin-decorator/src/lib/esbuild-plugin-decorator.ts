import fs from 'fs/promises';
import type { Plugin } from 'esbuild';
import type { ParsedCommandLine } from 'typescript';
import type { Options as SWCCompileOptions } from '@swc/core';
import merge from 'lodash/merge';

import { findDecorators } from './find-decorator';
import {
  normalizeOption,
  ESBuildPluginDecoratorOptions,
} from './normalize-option';

import { parseTsConfig, tscCompiler } from './tsc-compiler';
import { swcCompiler, defaultSWCCompilerOptions } from './swc-compiler';
import { noDecoratorsFound, pluginSkipped } from './log';

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
      verbose,
      tscCompilerOptions,
      swcCompilerOptions,
    } = normalizedOptions;

    let parsedTsConfig: ParsedCommandLine | null = null;
    let parsedSwcConfig: SWCCompileOptions | null = null;

    if (compiler === 'tsc') {
      build.onLoad({ filter: /\.ts$/ }, async ({ path }) => {
        if (!parsedTsConfig) {
          const configFromFile = parseTsConfig(tsconfigPath, cwd);

          parsedTsConfig = {
            ...configFromFile,
            options: {
              ...configFromFile.options,
              ...tscCompilerOptions,
            },
          };
        }

        const shouldSkipThisPlugin =
          !force &&
          (!parsedTsConfig?.options?.emitDecoratorMetadata ||
            !parsedTsConfig?.options?.experimentalDecorators);

        if (shouldSkipThisPlugin) {
          verbose && pluginSkipped();

          return;
        }

        const fileContent = await fs.readFile(path, 'utf8');

        const hasDecorator = findDecorators(fileContent);

        if (!hasDecorator) {
          verbose && noDecoratorsFound(path);
          return;
        }

        const contents = tscCompiler(fileContent, parsedTsConfig.options)
          .outputText;

        return { contents };
      });
    } else {
      build.onLoad({ filter: /\.ts$/ }, async ({ path }) => {
        if (!parsedSwcConfig) {
          // TODO: support .swcrc
          parsedSwcConfig = merge(
            defaultSWCCompilerOptions,
            swcCompilerOptions
          );
        }

        const shouldSkipThisPlugin =
          !force &&
          (!parsedSwcConfig.jsc.transform.decoratorMetadata ||
            !parsedSwcConfig.jsc.parser.decorators);

        if (shouldSkipThisPlugin) {
          verbose && pluginSkipped();

          return;
        }

        const fileContent = await fs.readFile(path, 'utf8');

        const hasDecorator = findDecorators(fileContent);

        if (!hasDecorator) {
          verbose && noDecoratorsFound(path);

          return;
        }

        const contents = swcCompiler(fileContent, parsedSwcConfig).code;

        return { contents };
      });
    }
  },
});
