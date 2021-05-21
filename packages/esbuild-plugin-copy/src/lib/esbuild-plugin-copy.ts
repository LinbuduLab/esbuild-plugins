import type { Plugin } from 'esbuild';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import globby, { GlobbyOptions } from 'globby';

type MaybeArray<T> = T | T[];

export interface AssetPair {
  // file/folder/globs
  from: MaybeArray<string>;
  to: MaybeArray<string>;
}

export interface Options {
  assets: MaybeArray<AssetPair>;
  copyOnStart: boolean;
  verbose: boolean;
  globbyOptions: GlobbyOptions;
}

function copyHandler(outDir: string, from: string, to: string) {
  const { base: fromPathBase } = path.parse(from);
  fs.ensureDirSync(path.resolve(outDir, to));
  fs.copyFileSync(path.resolve(from), path.resolve(outDir, to, fromPathBase));
}

function toArray<T>(item: MaybeArray<T>): Array<T> {
  return Array.isArray(item) ? item : [item];
}

function verboseLog(msg: string, verbose: boolean) {
  if (!verbose) {
    return;
  }
  console.log(chalk.blue('i'), msg);
}

function formatAssets(assets: MaybeArray<AssetPair>) {
  return toArray(assets)
    .filter((asset) => asset.from && asset.to)
    .map(({ from, to }) => ({
      from: toArray(from),
      to: toArray(to),
    }));
}

export default (options: Partial<Options> = {}): Plugin => {
  const {
    assets = [],
    copyOnStart = false,
    globbyOptions = {},
    verbose = true,
  } = options;

  const formattedAssets = formatAssets(assets);

  return {
    name: 'plugin:copy',
    setup(build) {
      build[copyOnStart ? 'onStart' : 'onEnd'](async () => {
        if (!formattedAssets.length) {
          return;
        }

        for (const { from, to } of formattedAssets) {
          const pathsCopyFrom = await globby(from, {
            expandDirectories: false,
            onlyFiles: false,
            ...globbyOptions,
          });

          verboseLog(
            `Files will be copied: \n${pathsCopyFrom.join('\n')}`,
            verbose
          );

          const outDir =
            build.initialOptions.outdir ??
            path.dirname(build.initialOptions.outfile);

          if (!outDir) {
            verboseLog(
              chalk.red(
                `You should provide valid outdir or outfile for assets copy. received outdir:${build.initialOptions.outdir}, received outfile:${build.initialOptions.outfile}`
              ),
              verbose
            );

            return;
          }

          for (const fromPath of pathsCopyFrom) {
            to.forEach((toPath) => copyHandler(outDir, fromPath, toPath));
          }
        }
      });
    },
  };
};
