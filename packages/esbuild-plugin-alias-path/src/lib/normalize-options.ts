import { CompilerOptions } from 'typescript';
import { loadCompilerOptions } from './load-compiler-options';
import fs from 'fs-extra';

export interface Options {
  // alias default as {}
  // {"a":"b"}
  // for absolute path: use
  // or connect with process.cwd() !
  alias?: Record<string, string>;

  // path of tsconfig.json
  tsconfigPath?: string;

  skip?: boolean;
}

export interface NormalizedOptions extends Options {
  compilerOptions: CompilerOptions | null;
}

export function normalizeOption(options: Options = {}): NormalizedOptions {
  const alias = options.alias ?? {};

  const tsconfigPath = options.tsconfigPath ?? undefined;

  const tsconfigPathInexist = tsconfigPath && !fs.existsSync(tsconfigPath);

  if (tsconfigPathInexist) {
    throw new Error(
      `[esbuild-plugin-alias-path] tsconfig ${tsconfigPath} does not exist.`
    );
  }

  const compilerOptions = loadCompilerOptions(tsconfigPath) || {};

  const shouldSkipThisPlugin =
    options.skip ??
    (!Object.keys(alias).length &&
      !Object.keys(compilerOptions.paths ?? {}).length);

  // TODO:
  // path which is not absolute and not start with ./ or ../ will be regarded as module,
  // and use require.resolve(module) to resolve paths
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
    alias: alias,
    tsconfigPath,
    compilerOptions,
    skip: shouldSkipThisPlugin,
  };
}
