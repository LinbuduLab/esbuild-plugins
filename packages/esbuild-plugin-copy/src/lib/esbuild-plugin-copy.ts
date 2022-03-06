import type { Plugin } from 'esbuild';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import globby, { GlobbyOptions } from 'globby';

type MaybeArray<T> = T | T[];

// file/folder/globs
export interface AssetPair {
  // from path is resolved based on cwd
  from: MaybeArray<string>;
  // to path is resolved based on outdir or outfile in your ESBuild options
  to: MaybeArray<string>;
}

export interface Options {
  assets: MaybeArray<AssetPair>;
  copyOnStart: boolean;
  verbose: boolean;
  globbyOptions: GlobbyOptions;
  once: boolean;
}

/**
 * 存在的几种情况
 *
 * dir
 * dir/*
 * file.ext
 *
 * @param outDir
 * @param from
 * @param to
 */
function copyHandler(outDir: string, from: string, to: string, verbose = true) {
  // console.log('start=====');
  // absolute file path for each pair's from
  const sourcePath = path.resolve(from);

  // console.log(sourceDirPath, distDirPath, '\n');

  // console.log(outDir, from, to);

  const parsedFromPath = path.parse(from);
  // console.log('parsedFromPath: ', parsedFromPath);
  const parsedToPath = path.parse(to);
  // console.log('parsedToPath: ', parsedToPath);

  // fs.copyFileSync(path.resolve(from), path.resolve(outDir, to, fromPathBase));

  // from path 是一定会有 ext 的，因为会用 glob 扫一下

  // if we specified file name in to path, we use its basename
  // or, we make the from path base as default
  const distBaseName = parsedToPath.ext.length
    ? parsedToPath.base
    : parsedFromPath.base;

  // if we specified file name in to path, the parsed dir will be '.'
  // so we need to use its base as alternative
  // or we can just use its dir
  const distDir =
    parsedToPath.dir === '.' ? parsedToPath.base : parsedToPath.dir;

  const distPath = path.resolve(outDir, distDir, distBaseName);

  fs.ensureDirSync(path.dirname(distPath));
  fs.copyFileSync(sourcePath, distPath);

  verboseLog(
    `File copied: ${chalk.white(sourcePath)} -> ${chalk.white(distPath)}`,
    verbose
  );
}

function ensureArray<T>(item: MaybeArray<T>): Array<T> {
  return Array.isArray(item) ? item : [item];
}

function verboseLog(msg: string, verbose: boolean) {
  if (!verbose) {
    return;
  }
  console.log(chalk.blue('i'), msg);
}

function formatAssets(
  assets: MaybeArray<AssetPair>
): Record<'from' | 'to', string[]>[] {
  return ensureArray(assets)
    .filter((asset) => asset.from && asset.to)
    .map(({ from, to }) => ({
      from: ensureArray(from),
      to: ensureArray(to),
    }));
}

const PLUGIN_EXECUTED_FLAG = 'esbuild_copy_executed';

export const copy = (options: Partial<Options> = {}): Plugin => {
  const {
    assets = [],
    copyOnStart = false,
    globbyOptions = {},
    verbose = true,
    once = false,
  } = options;

  const formattedAssets = formatAssets(assets);

  const applyHook = copyOnStart ? 'onStart' : 'onEnd';

  return {
    name: 'plugin:copy',
    setup(build) {
      build[applyHook](async () => {
        if (once && process.env[PLUGIN_EXECUTED_FLAG] === 'true') {
          verboseLog(
            `Copy plugin skipped as option ${chalk.white('once')} set to true`,
            verbose
          );
          return;
        }

        if (!formattedAssets.length) {
          return;
        }

        for (const { from, to } of formattedAssets) {
          const pathsCopyFrom = await globby(from, {
            expandDirectories: false,
            onlyFiles: true,
            ...globbyOptions,
          });

          const outDir =
            build.initialOptions.outdir ??
            path.dirname(build.initialOptions.outfile!);

          if (!outDir) {
            verboseLog(
              chalk.red(
                `You should provide valid ${chalk.white(
                  'outdir'
                )} or ${chalk.white(
                  'outfile'
                )} for assets copy. received outdir:${
                  build.initialOptions.outdir
                }, received outfile:${build.initialOptions.outfile}`
              ),
              verbose
            );

            return;
          }

          for (const fromPath of pathsCopyFrom) {
            to.forEach((toPath) => copyHandler(outDir, fromPath, toPath));
          }
          process.env[PLUGIN_EXECUTED_FLAG] = 'true';
        }
      });
    },
  };
};
