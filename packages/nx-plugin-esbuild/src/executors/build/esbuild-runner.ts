import type { BuildResult, BuildFailure, BuildOptions } from 'esbuild';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import {} from 'rxjs/operators';
import { build } from 'esbuild';
import watch from 'node-watch';

interface RunBuildResponse {
  buildResult: BuildResult | null;
  buildFailure: BuildFailure | null;
}

export function runESBuild(
  options: BuildOptions,
  watchDir?: string
): Observable<RunBuildResponse> {
  return new Observable<RunBuildResponse>((subscriber) => {
    const cwd = watchDir || options.absWorkingDir || process.cwd();

    // 不使用esbuild原本的watch能力
    const { watch: buildWatch, ...opts } = options;

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
          ? watch(cwd, { recursive: true }, (eventtType, triggerPath) => {
              console.log('eventtType: ', eventtType);
              console.log('triggerPath: ', triggerPath);
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
