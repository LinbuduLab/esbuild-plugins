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
      ...esbuildBuildOptions
    } = options;

    buildWatch &&
      console.log(
        `${chalk.blue('i')} Watching ${info(`${watchDir} for changes ...`)}\n`
      );

    const watcher = buildWatch
      ? chokidar.watch(
          // ...assetsDirs.map((dir) => dir.input)
          [watchDir],
          {
            ignored: ['node_modules', '.git'],
            cwd: watchDir,
            ignorePermissionErrors: false,
            depth: 99,
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
