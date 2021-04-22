import path from 'path';
import { CompilerOptions as TSCCompileOptions } from 'typescript';
import { Options as SWCCompileOptions } from '@swc/core';
import { pluginTitle, info, warn } from './log';

export type ESBuildPluginDecoratorOptions = {
  tsconfigPath?: string;
  force?: boolean;
  cwd?: string;

  compiler?: 'tsc' | 'swc';

  isNxProject?: boolean;
  tscCompilerOptions?: TSCCompileOptions;
  swcCompilerOptions?: SWCCompileOptions;
};

export function normalizeOption(
  options: ESBuildPluginDecoratorOptions = {}
): Required<ESBuildPluginDecoratorOptions> {
  const isNxProject = options.isNxProject ?? false;

  // should use project tsconfig.json
  // if not specified, will use PROJECT_ROOT/tsconfig.json
  // (in nx project will use PROJECT_ROOT/tsconfig.base.json)
  const tsconfigPath = options.tsconfigPath
    ? options.tsconfigPath
    : isNxProject
    ? path.join(process.cwd(), './tsconfig.base.json')
    : path.join(process.cwd(), './tsconfig.json');

  // TODO: check does file exist here

  console.log(
    `${pluginTitle()} ${info('Load ts config file from')} ${tsconfigPath}`
  );

  const cwd = options.cwd ?? process.cwd();

  console.log(`${pluginTitle()} ${info('Current working directory')} ${cwd}`);

  const force = options.force ?? false;
  const compiler = options.compiler ?? 'tsc';

  console.log(
    `${pluginTitle()} ${info('Decorator Compilation by')} [${compiler}]\n`
  );

  if (compiler === 'tsc' && options.swcCompilerOptions) {
    console.log(
      `${pluginTitle()} ${warn(
        "You're using tsc compiler with swc options, swc options will be ignored."
      )}\n`
    );
  }

  if (compiler === 'swc' && options.tscCompilerOptions) {
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
    force,
    cwd,
    isNxProject,
    compiler,
    tscCompilerOptions,
    swcCompilerOptions,
  };
}
