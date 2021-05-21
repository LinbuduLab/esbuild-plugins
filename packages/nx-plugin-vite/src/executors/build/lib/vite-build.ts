import { ViteBuildSchema } from '../schema';
import { Observable } from 'rxjs';
import { build } from 'vite';

import { Res } from '../../utils/types';
import { RollupWatcher, RollupOutput } from 'rollup';

const determineIsWacther = (
  watch: boolean,
  watcherOrOutput: RollupWatcher | RollupOutput | RollupOutput[]
): watcherOrOutput is RollupWatcher => {
  return watch;
};

export const startViteBuild = (schema: ViteBuildSchema): Observable<Res> => {
  return new Observable<Res>((subscriber) => {
    build({
      root: schema.root,
      configFile: schema.configFile,
      build: {
        watch: schema.watch ? {} : null,
        outDir: schema.outDir,
        write: schema.write,
      },
    }).then((watcherOrOutput) => {
      if (determineIsWacther(schema.watch, watcherOrOutput)) {
        watcherOrOutput.addListener('event', (event) => {
          subscriber.next({
            success: event.code !== 'ERROR',
          });
        });
      }
      // apply modifications on RollupOutput ?
    });
  });
};
