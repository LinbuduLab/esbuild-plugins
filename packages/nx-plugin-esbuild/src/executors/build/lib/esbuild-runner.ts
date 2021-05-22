import type { BuildFailure } from 'esbuild';
import type { ESBuildRunnerOptions, ESBuildRunnerResponse } from './types';

import { Observable } from 'rxjs';
import { build } from 'esbuild';
import chokidar from 'chokidar';
import { copyAssetFiles } from 'nx-plugin-devkit';
import { error, info, success } from './log';

export function runESBuild(
  options: ESBuildRunnerOptions,
  watchDir: string
): Observable<ESBuildRunnerResponse> {
  return new Observable<ESBuildRunnerResponse>((subscriber) => {
    const assetsDirs = options.assets;

    // FIXME: only UPDATE assets will trigger correct re-build
    // support all types or support neither
    const watcher = chokidar.watch(
      [watchDir, ...assetsDirs.map((dir) => dir.input)],
      {
        ignored: ['node_modules', '.git'],
        cwd: watchDir,
        ignorePermissionErrors: false,
        depth: 99,
      }
    );

    copyAssetFiles(assetsDirs);

    // donot send extra params then ESBuild build API need.
    const {
      watch: buildWatch,
      assets: _uselessAssetsOption,
      failFast,
      ...esbuildBuildOptions
    } = options;

    build(esbuildBuildOptions)
      .then((buildResult) => {
        subscriber.next({ buildResult, buildFailure: null });

        const watchNext = ({
          buildFailure,
          buildResult,
        }: ESBuildRunnerResponse) => {
          subscriber.next({ buildFailure, buildResult });

          if (typeof buildWatch === 'object' && buildWatch.onRebuild) {
            buildWatch.onRebuild(buildFailure, buildResult);
          }
        };

        buildWatch
          ? watcher.on('all', (eventName, path) => {
              console.log(
                `${success('Change Detected:')} ${info(
                  eventName.toLocaleUpperCase()
                )} ${info(path)}`
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
