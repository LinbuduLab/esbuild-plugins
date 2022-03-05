import path from 'path';
import fs from 'fs-extra';
import { CompilerOptions as TSCCompileOptions } from 'typescript';
import { Options as SWCCompileOptions } from '@swc/core';
import { pluginTitle, info, err } from './log';
import consola from 'consola';
import chalk from 'chalk';

export interface ESBuildPluginDecoratorOptions {
  // tsconfig path (tsconfig.json)
  tsconfigPath?: string;
  // swc config path (.swcrc)
  swcrcPath?: string;

  // force specified compiler for all code compilation
  // (even no decorators are found)
  // if set to false, plugin will be skipped when no decorators are found
  force?: boolean;

  cwd?: string;

  // use typescript or @swc/core for decorator compilation
  compiler?: 'tsc' | 'swc';

  // extra compile options
  tscCompilerOptions?: TSCCompileOptions;
  swcCompilerOptions?: SWCCompileOptions;

  // verbose logging
  verbose?: boolean;
}

export function normalizeOption(
  options: ESBuildPluginDecoratorOptions = {}
): Required<ESBuildPluginDecoratorOptions> {
  const cwd = options.cwd ?? process.cwd();
  const force = options.force ?? false;
  const compiler = options.compiler ?? 'tsc';
  const verbose = options.verbose ?? false;

  // if not specified, will use PROJECT_ROOT/tsconfig.json
  const tsconfigPath = options.tsconfigPath
    ? path.isAbsolute(options.tsconfigPath)
      ? options.tsconfigPath
      : path.resolve(cwd, options.tsconfigPath)
    : path.resolve(cwd, './tsconfig.json');

  const swcrcPath = options.swcrcPath
    ? path.isAbsolute(options.swcrcPath)
      ? options.swcrcPath
      : path.resolve(cwd, options.swcrcPath)
    : path.resolve(cwd, './.swcrc');

  const tsconfigExist = fs.existsSync(tsconfigPath);
  const swcrcExist = fs.existsSync(swcrcPath);

  // ts config file is required even you are using swc as compiler
  if (!tsconfigExist) {
    throw new Error(
      `Failed to load ts config from ${tsconfigPath}, file does not exist.`
    );
  }

  verbose &&
    consola.info(
      `${pluginTitle()} ${info('Loading tsconfig file from:')} ${tsconfigPath}`
    );

  if (compiler === 'swc' && !swcrcExist) {
    verbose &&
      consola.warn(
        `${pluginTitle()} ${err(
          `.swcrc file from ${swcrcPath} is not found, using default swc options`
        )}`
      );
  } else if (compiler === 'swc' && swcrcExist) {
    verbose &&
      consola.warn(
        `${pluginTitle()} ${info('Loading swc config file from')} ${swcrcPath}`
      );
  }

  verbose &&
    consola.info(
      `${pluginTitle()} ${info('Decorator Compilation by')} [${chalk.white(
        compiler
      )}]\n`
    );

  if (compiler === 'tsc' && options.swcCompilerOptions) {
    verbose &&
      consola.info(
        `${pluginTitle()} ${"You're using tsc compiler with swc options, swc options will be ignored."}\n`
      );
  }

  if (compiler === 'swc' && options.tscCompilerOptions) {
    verbose &&
      consola.info(
        `${pluginTitle()} ${"You're using swc compiler with tsc options, tsc options will be ignored."}\n`
      );
  }

  const tscCompilerOptions = options.tscCompilerOptions ?? {};
  const swcCompilerOptions = options.swcCompilerOptions ?? {};

  if (swcCompilerOptions?.jsc?.externalHelpers) {
    consola.warn(
      `${pluginTitle()} ${'You are using SWC jsc.externalHelpers option, which requires you to add @swc/helpers to ESBuild externals'}\n`
    );
  }

  return {
    tsconfigPath,
    swcrcPath,
    force,
    cwd,
    compiler,
    tscCompilerOptions,
    swcCompilerOptions,
    verbose,
  };
}
