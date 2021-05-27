import { from, Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { startServer } from 'snowpack';

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
    ? `Using External Config File`
    : 'Using Internal Default Config';

  return from(configResolver).pipe(
    tap(() => {
      console.log(chalk.blue('i'), chalk.green('Nx-Snowpack [Serve] Starting'));
      console.log(chalk.blue('i'), chalk.green(configLoadInfo));
    }),
    switchMap((config) => {
      return new Observable<RunnerResponse>((subscriber) => {
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
    })
  );
};
