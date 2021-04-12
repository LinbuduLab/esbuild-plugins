import type { BuildResult, BuildFailure, BuildOptions } from 'esbuild';
import { Observable } from 'rxjs';
import { build } from 'esbuild';
import chokidar from 'chokidar';
import { FileInputOutput } from '../schema';
import copyAssetFiles from './copy-assets';

interface RunBuildResponse {
  buildResult: BuildResult | null;
  buildFailure: BuildFailure | null;
}

export function runESBuild(
  options: BuildOptions & {
    assets: FileInputOutput[];
  },
  watchDir?: string
): Observable<RunBuildResponse> {
  return new Observable<RunBuildResponse>((subscriber) => {
    const cwd = watchDir || options.absWorkingDir || process.cwd();

    const assetsDirs = options.assets;

    const watcher = chokidar.watch(
      [cwd, ...assetsDirs.map((dir) => dir.input)],
      {
        ignored: ['node_modules'],
        cwd,
        ignorePermissionErrors: false,
        depth: 99,
      }
    );

    copyAssetFiles(assetsDirs);

    // 不使用esbuild原本的watch能力
    const { watch: buildWatch, assets, ...opts } = options;

    build(opts)
      .then((buildResult) => {
        subscriber.next({ buildResult, buildFailure: null });

        const watchNext = ({ buildFailure, buildResult }: RunBuildResponse) => {
          subscriber.next({ buildFailure, buildResult });
          if (typeof buildWatch === 'object' && buildWatch.onRebuild) {
            buildWatch.onRebuild(buildFailure, buildResult);
          }
        };

        buildWatch
          ? watcher.on('all', (eventName, path) => {
              console.log('eventName: ', eventName);
              console.log('path: ', path);

              buildResult
                .rebuild()
                .then((watchResult) => {
                  watchNext({
                    buildFailure: null,
                    buildResult: watchResult,
                  });
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
        subscriber.complete();
      })
      .finally(() => {
        console.log('ESBuild Compilation Done');
      });
  });
}
