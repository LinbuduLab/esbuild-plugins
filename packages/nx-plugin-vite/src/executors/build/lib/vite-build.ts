import type { ViteBuildSchema } from '../schema';
import type { Res } from '../../utils/types';
import type { RollupWatcher, RollupOutput } from 'rollup';

import { Observable } from 'rxjs';
import { build } from 'vite';

const isRollupWacther = (
  watch: boolean,
  watcherOrOutput: RollupWatcher | RollupOutput | RollupOutput[]
): watcherOrOutput is RollupWatcher => {
  return watch;
};

export const startViteBuild = (schema: ViteBuildSchema): Observable<Res> => {
  return new Observable<Res>((subscriber) => {
    const { root, configFile, watch, outDir, write, manifest } = schema;

    build({
      root,
      configFile,
      build: {
        watch: watch ? {} : null,
        outDir,
        write,
        manifest,
      },
    })
      .then((watcherOrOutput) => {
        if (isRollupWacther(schema.watch, watcherOrOutput)) {
          watcherOrOutput.addListener('event', (event) => {
            event.code === 'ERROR'
              ? subscriber.error({
                  error: event.error,
                })
              : subscriber.next({
                  success: true,
                });
          });
        } else {
          subscriber.next({
            success: true,
          });
          subscriber.complete();
        }
      })
      .catch((error) => {
        subscriber.error({
          success: false,
          error,
        });
      });
  });
};
