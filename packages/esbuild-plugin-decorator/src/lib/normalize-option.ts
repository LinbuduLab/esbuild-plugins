import path from 'path';
import fs from 'fs-extra';
import { CompilerOptions as TSCCompileOptions } from 'typescript';
import { Options as SWCCompileOptions } from '@swc/core';
import { pluginTitle, info, warn, err } from './log';

export interface ESBuildPluginDecoratorOptions {
  tsconfigPath?: string;
  swcrcPath?: string;

  force?: boolean;

  cwd?: string;

  compiler?: 'tsc' | 'swc';

  isNxProject?: boolean;
  tscCompilerOptions?: TSCCompileOptions;
  swcCompilerOptions?: SWCCompileOptions;

  verbose?: boolean;
}

export function normalizeOption(
  options: ESBuildPluginDecoratorOptions = {}
): Required<ESBuildPluginDecoratorOptions> {
  // default as workspace root
  const cwd = options.cwd ?? process.cwd();
  const force = options.force ?? false;
  const compiler = options.compiler ?? 'tsc';

  const isNxProject = options.isNxProject ?? false;
  const verbose = options.verbose ?? true;

  // if not specified, will use PROJECT_ROOT/tsconfig.json
  // (in nx project will use PROJECT_ROOT/tsconfig.base.json)
  const tsconfigPath = options.tsconfigPath
    ? options.tsconfigPath
    : isNxProject
    ? path.resolve(cwd, './tsconfig.base.json')
    : path.resolve(cwd, './tsconfig.json');

  const swcrcPath = options.swcrcPath
    ? options.swcrcPath
    : path.resolve(cwd, './.swcrc');

  const tsconfigExist = fs.existsSync(tsconfigPath);
  const swcrcExist = fs.existsSync(swcrcPath);

  // ts config file is required even you are using swc as compiler
  if (!tsconfigExist) {
    throw new Error(
      `Failed to load ts config from ${tsconfigPath}, file does not exist.`
    );
  }

  console.log(
    `${pluginTitle()} ${info('Load ts config file from')} ${tsconfigPath}`
  );

  if (compiler === 'swc' && !swcrcExist) {
    console.log(
      `${pluginTitle()} ${err(
        `.swcrc file from ${swcrcPath} is not found, using default swc options`
      )})`
    );
  } else if (compiler === 'swc' && swcrcExist) {
    console.log(
      `${pluginTitle()} ${info('Load swc config file from')} ${swcrcPath}`
    );
  }

  console.log(`${pluginTitle()} ${info('Current working directory')} ${cwd}`);

  verbose &&
    console.log(
      `${pluginTitle()} ${info('Decorator Compilation by')} [${compiler}]\n`
    );

  if (compiler === 'tsc' && options.swcCompilerOptions) {
    verbose &&
      console.log(
        `${pluginTitle()} ${warn(
          "You're using tsc compiler with swc options, swc options will be ignored."
        )}\n`
      );
  }

  if (compiler === 'swc' && options.tscCompilerOptions) {
    verbose &&
      console.log(
        `${pluginTitle()} ${warn(
          "You're using swc compiler with tsc options, tsc options will be ignored."
        )}\n`
      );
  }

  const tscCompilerOptions = options.tscCompilerOptions ?? {};
  const swcCompilerOptions = options.swcCompilerOptions ?? {};

  if (swcCompilerOptions?.jsc?.externalHelpers) {
    console.log(
      `${pluginTitle()} ${warn(
        'You are use SWC jsc.externalHelpers option, which requires you to add @swc/helpers to ESBuild externals'
      )}\n`
    );
  }

  return {
    tsconfigPath,
    swcrcPath,
    force,
    cwd,
    isNxProject,
    compiler,
    tscCompilerOptions,
    swcCompilerOptions,
    verbose,
  };
}
