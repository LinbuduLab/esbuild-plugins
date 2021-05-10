import { CompilerOptions } from 'typescript';
import { loadCompilerOptions } from './load-compiler-options';
import fs from 'fs-extra';

export interface Options {
  // alias default as {}
  // {"a":"b"}
  alias?: Record<string, string>;

  // path of tsconfig.json
  tsconfigPath?: string;

  skip?: boolean;
}

export interface NormalizedOptions {
  alias: Record<string, string>;

  tsconfigPath: string | undefined;
  compilerOptions: CompilerOptions | null;

  skip: boolean;
}

export function normalizeOption(options: Options = {}): NormalizedOptions {
  const alias = options.alias ?? {};

  const tsconfigPath = options.tsconfigPath ?? undefined;

  const tsconfigPathInexist = tsconfigPath && !fs.existsSync(tsconfigPath);

  if (tsconfigPathInexist) {
    throw new Error(
      `[esbuild-plugin-alis-path] tsconfig ${tsconfigPath} does not exist.`
    );
  }

  const compilerOptions = loadCompilerOptions(tsconfigPath) || {};

  // FIXME:
  const shouldSkipThisPlugin =
    options.skip ??
    (tsconfigPathInexist &&
      !Object.keys(alias).length &&
      !compilerOptions.paths);

  // path which is not absolute and not start with ./ or ../ will be regarded as module, and use require.resolve(module) to resolve paths
  // this feature is to support nx json configuration
  // const resolveModule = options?.resolveModule ?? true;

  const normalizedAlias: Record<string, string> = {};

  // for (const [from, to] of Object.entries(alias)) {
  //   if (
  //     !path.isAbsolute(to) &&
  //     !to.startsWith('.') &&
  //     !to.startsWith('..') &&
  //     resolveModule
  //   ) {
  //     normalizedAlias[from] = require.resolve(to);
  //   } else {
  //     normalizedAlias[from] = to;
  //   }
  // }

  return {
    alias: normalizedAlias,
    tsconfigPath,
    compilerOptions,
    skip: shouldSkipThisPlugin,
  };
}
