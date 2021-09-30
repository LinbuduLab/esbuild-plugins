import type { BuildFailure } from 'esbuild';
import type { ESBuildRunnerOptions, ESBuildRunnerResponse } from './types';
import { Observable } from 'rxjs';
import { build } from 'esbuild';
import chokidar, { FSWatcher } from 'chokidar';
import { copyAssetFiles } from 'nx-plugin-devkit';
import chalk from 'chalk';
import consola from 'consola';
import { info } from './log';
import uniq from 'lodash/uniq';
import clear from 'clear';

export function runESBuild(
  options: ESBuildRunnerOptions
): Observable<ESBuildRunnerResponse> {
  return new Observable<ESBuildRunnerResponse>((subscriber) => {
    // donot send extra params then ESBuild build API need.
    const {
      watch: buildWatch,
      assets: assetsDirs,

      failFast,
      watchDir,
      watchOptions,
      watchAssetsDir,
      verbose,
      absoulteProjectRoot,
      ...esbuildBuildOptions
    } = options;

    if (typeof options.write === 'boolean' && !options.write && verbose) {
      consola.warn(
        `ESBuild ${info('BuildOptions.write')} set to ${info('false')}. \n`
      );
    }

    buildWatch &&
      consola.info(
        `Watching ${info(
          `${uniq(
            watchDir.map((dir) =>
              dir.replace(`${esbuildBuildOptions.absWorkingDir}/`, '')
            )
          ).join(', ')}`
        )} for changes ...\n`
      );

    const { ignored = [], ...restWatchOptions } = watchOptions;

    const watcher: FSWatcher | null = buildWatch
      ? chokidar.watch(
          [...watchDir].concat(
            watchAssetsDir ? assetsDirs.map((dir) => dir.input) : []
          ),
          {
            ignored: ['node_modules', '.git']
              .concat(watchAssetsDir ? [] : assetsDirs.map((dir) => dir.input))
              .concat(ignored),
            cwd: absoulteProjectRoot,
            ignorePermissionErrors: false,
            depth: 99,
            ...restWatchOptions,
          }
        )
      : null;

    const watchNext = ({
      buildFailure,
      buildResult,
    }: ESBuildRunnerResponse) => {
      subscriber.next({ buildFailure, buildResult });

      if (typeof buildWatch === 'object' && buildWatch.onRebuild) {
        buildWatch.onRebuild(buildFailure, buildResult);
      }
    };

    // Copy assets for the first time
    copyAssetFiles(assetsDirs);

    build(esbuildBuildOptions)
      .then((buildResult) => {
        subscriber.next({ buildResult, buildFailure: null });

        buildWatch
          ? watcher.on('all', (eventName, path) => {
              consola.info(
                `${chalk.white('Changes Detected:')} ${info(
                  eventName.toLocaleUpperCase()
                )} of ${info(path)}`
              );

              buildResult
                .rebuild()
                .then((watchResult) => {
                  watchNext({
                    buildFailure: null,
                    buildResult: watchResult,
                  });

                  copyAssetFiles(assetsDirs);
                })
                .catch((watchFailure: BuildFailure) => {
                  watchNext({
                    buildFailure: watchFailure,
                    buildResult: null,
                  });
                });
            })
          : subscriber.complete();
      })
      .catch((buildFailure: BuildFailure) => {
        subscriber.next({ buildResult: null, buildFailure });
        failFast && subscriber.complete();
      });
  });
}
