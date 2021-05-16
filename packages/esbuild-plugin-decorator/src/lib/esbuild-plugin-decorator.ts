import fs from 'fs-extra';
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
import {
  swcCompiler,
  defaultSWCCompilerOptions,
  parseSWCConfig,
} from './swc-compiler';
import { noDecoratorsFound, pluginSkipped } from './log';

export const esbuildPluginDecorator = (
  options: Partial<ESBuildPluginDecoratorOptions> = {}
): Plugin => ({
  name: 'decorator',
  setup(build) {
    const normalizedOptions = normalizeOption(options);

    const {
      tsconfigPath,
      swcrcPath,
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

        const decoratorConfigExist =
          parsedTsConfig?.options?.emitDecoratorMetadata &&
          parsedTsConfig?.options?.experimentalDecorators;

        // force: true
        // plugin will not be skipped
        // force: false
        // when decoratorConfigExist: false
        // skip plugin
        // else
        // apply plugin
        const shouldSkipThisPlugin = force ? false : !decoratorConfigExist;

        if (shouldSkipThisPlugin) {
          verbose && pluginSkipped(path);

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
          const swcrcConfig = parseSWCConfig(swcrcPath);

          parsedSwcConfig = merge(
            defaultSWCCompilerOptions,
            swcrcConfig,
            swcCompilerOptions
          );
        }

        const decoratorConfigExist =
          parsedSwcConfig.jsc.transform.decoratorMetadata &&
          parsedSwcConfig.jsc.parser.decorators;

        // force: true
        // plugin will not be skipped
        // force: false
        // when decoratorConfigExist: false
        // skip plugin
        // else
        // apply plugin
        const shouldSkipThisPlugin = force ? false : !decoratorConfigExist;

        if (shouldSkipThisPlugin) {
          verbose && pluginSkipped(path);

          return;
        }

        const fileContent = fs.readFileSync(path, 'utf8');

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
