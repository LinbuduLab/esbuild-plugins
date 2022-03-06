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

  keepStructure?: boolean;
}

export interface Options {
  /**
   * @default []
   */
  assets: MaybeArray<AssetPair>;
  /**
   * @default true
   */
  copyOnStart: boolean;
  /**
   * we set this option to be true by default because it outputs
   * from-path and to-path used by `fs.copyFileSync`
   * @default true
   */
  verbose: boolean;
  /**
   * options passed to `globby` when we 're globbing for files to copy
   * @default {}
   */
  globbyOptions: GlobbyOptions;
  /**
   * only execute copy operation once
   * useful when you're using ESBuild.build watching mode
   * @default false
   */
  once: boolean;
  /**
   * keep raw assets dir structure for all assets pairs
   * @default true
   */
  keepStructure: boolean;
}

function keepStructureCopyHandler(
  outDir: string,
  rawFromPath: string[],
  globbedFromPath: string,
  baseToPath: string,
  verbose = true
) {
  // we keep structure only when input from path ends with /**/*(.ext)
  // for \/* only, we use simple merge copy handler
  // we only support /**/* now
  // and /**/*.js?

  for (const rawFrom of rawFromPath) {
    const { dir } = path.parse(rawFrom);

    // be default, when ends with /*, glob doesnot expand directories
    // avoid use override option `expandDirectories` and use `/*`
    if (!dir.endsWith('/**')) {
      verboseLog(
        `You're using ${chalk.white(
          'Keep-Structure'
        )} mode for the assets paire which its ${chalk.white(
          'from'
        )} path doesnot ends with ${chalk.white(
          '/**/*(.ext)'
        )}, fallback to ${chalk.white('Merge-Structure')} mode`,
        verbose
      );
      mergeCopyHandler(outDir, globbedFromPath, baseToPath, verbose);
    }

    const startFragment = dir.replace(`/**`, '');

    const [, preservedDirStructure] = globbedFromPath.split(startFragment);

    const sourcePath = path.resolve(globbedFromPath);

    const composedDistDirPath = path.resolve(
      outDir,
      baseToPath,
      preservedDirStructure.slice(1)
    );

    fs.ensureDirSync(path.dirname(composedDistDirPath));
    fs.copyFileSync(sourcePath, composedDistDirPath);

    verboseLog(
      `File copied: ${chalk.white(sourcePath)} -> ${chalk.white(
        composedDistDirPath
      )}`,
      verbose
    );
  }
}

function mergeCopyHandler(
  outDir: string,
  from: string,
  to: string,
  verbose = true
) {
  // absolute file path for each pair's from
  const sourcePath = path.resolve(from);

  const parsedFromPath = path.parse(from);
  const parsedToPath = path.parse(to);

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

function formatAssets(assets: MaybeArray<AssetPair>) {
  return ensureArray(assets)
    .filter((asset) => asset.from && asset.to)
    .map(({ from, to, keepStructure = false }) => ({
      from: ensureArray(from),
      to: ensureArray(to),
      keepStructure,
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
    keepStructure: globalKeepStructure = false,
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

        for (const {
          from,
          to,
          keepStructure: pairKeepStructure,
        } of formattedAssets) {
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

          const keep = globalKeepStructure || pairKeepStructure;

          console.log(
            `\nUse ${chalk.white(
              keep ? 'Keep-Structure' : 'Merge-Structure'
            )} for current assets pair.`
          );

          const deduplicatedPaths = [...new Set(pathsCopyFrom)];

          if (!deduplicatedPaths.length) {
            console.log(
              `No files matched using current glob pattern: ${chalk.white(
                from
              )}, maybe you need to configure globby by ${chalk.white(
                'options.globbyOptions'
              )}?`
            );
          }

          for (const fromPath of deduplicatedPaths) {
            to.forEach((toPath) => {
              keep
                ? keepStructureCopyHandler(outDir, from, fromPath, toPath)
                : mergeCopyHandler(outDir, fromPath, toPath);
            });
          }
          process.env[PLUGIN_EXECUTED_FLAG] = 'true';
        }
      });
    },
  };
};
