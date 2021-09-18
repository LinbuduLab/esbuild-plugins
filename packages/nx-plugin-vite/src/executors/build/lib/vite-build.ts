import { ViteBuildSchema } from '../schema';
import { Observable } from 'rxjs';
import { build } from 'vite';

import { Res } from '../../utils/types';
import { RollupWatcher, RollupOutput } from 'rollup';
import chalk from 'chalk';

const isRollupWacther = (
  watch: boolean,
  watcherOrOutput: RollupWatcher | RollupOutput | RollupOutput[]
): watcherOrOutput is RollupWatcher => {
  return watch;
};

export const startViteBuild = (schema: ViteBuildSchema): Observable<Res> => {
  return new Observable<Res>((subscriber) => {
    console.log(chalk.blue('i'), chalk.cyan('Nx-Vite [Build] Starting'));
    console.log('');

    build({
      root: schema.root,
      configFile: schema.configFile,
      build: {
        watch: schema.watch ? {} : null,
        outDir: schema.outDir,
        write: schema.write,
        manifest: schema.manifest,
      },
    })
      .then((watcherOrOutput) => {
        if (isRollupWacther(schema.watch, watcherOrOutput)) {
          watcherOrOutput.addListener('event', (event) => {
            subscriber.next({
              success: event.code !== 'ERROR',
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
