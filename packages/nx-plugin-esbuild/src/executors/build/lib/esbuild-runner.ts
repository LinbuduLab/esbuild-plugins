import type { BuildFailure } from 'esbuild';
import type { ESBuildRunnerOptions, ESBuildRunnerResponse } from './types';
import { Observable } from 'rxjs';
import { build } from 'esbuild';
import chokidar from 'chokidar';
import { copyAssetFiles } from 'nx-plugin-devkit';
import chalk from 'chalk';

import { error, info, success } from './log';

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
      ...esbuildBuildOptions
    } = options;

    if (!options.write) {
      console.log(
        chalk.yellow('WARN'),
        `ESBuild ${info('BuildOptions.write')} is set to ${info('false')}.`
      );
    }

    buildWatch &&
      console.log(
        `${chalk.blue('i')} Watching ${info(`${watchDir}`)} for changes ...\n`
      );

    const watcher = buildWatch
      ? chokidar.watch(
          [watchDir].concat(
            watchAssetsDir ? assetsDirs.map((dir) => dir.input) : []
          ),

          {
            ignored: ['node_modules', '.git'].concat(
              watchAssetsDir ? [] : assetsDirs.map((dir) => dir.input)
            ),
            cwd: watchDir,
            ignorePermissionErrors: false,
            depth: 99,
            ...watchOptions,
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

    copyAssetFiles(assetsDirs);

    build(esbuildBuildOptions)
      .then((buildResult) => {
        subscriber.next({ buildResult, buildFailure: null });

        buildWatch
          ? watcher.on('all', (eventName, path) => {
              console.log(
                `${'\nChanges Detected:'} ${info(
                  eventName.toLocaleUpperCase()
                )} ${info(path)}\n`
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
        if (failFast) {
          subscriber.complete();
        }
      })
      .finally(() => {});
  });
}
