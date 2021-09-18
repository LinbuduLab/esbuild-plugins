import { from, Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { startServer, clearCache } from 'snowpack';

import { loadSnowpackConfig, createSnowpackConfig } from './nomalize-config';
import { NormalizedSnowpackServeSchema } from '../schema';
import { RunnerResponse } from '../../../utils/types';
import chalk from 'chalk';

export const snowpackServer = (
  options: NormalizedSnowpackServeSchema
): Observable<RunnerResponse> => {
  const configResolver = options.configPath
    ? loadSnowpackConfig(options)
    : of(createSnowpackConfig(options));

  const configLoadInfo = options.configPath
    ? `external config file`
    : 'internal default config';

  return from(configResolver).pipe(
    tap(() => {
      console.log(
        chalk.blue('i'),
        chalk.cyan('Nx-Snowpack [Serve] Starting'),
        `(${chalk.white(configLoadInfo)}).\n`
      );
    }),
    switchMap((config) => {
      return new Observable<RunnerResponse>((subscriber) => {
        (options.clearCache ? clearCache() : Promise.resolve()).then(() => {
          startServer({ config })
            .then((server) => {
              // server.onFileChange
              // server.getServerRuntime

              subscriber.next({
                success: true,
              });
            })
            .catch((error) =>
              subscriber.error({
                success: false,
                error,
              })
            );
        });
      });
    })
  );
};
