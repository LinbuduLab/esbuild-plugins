import { NormalizedSnowpackBuildSchema } from '../schema';
import { from, Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { build, clearCache } from 'snowpack';
import { loadSnowpackConfig, createSnowpackConfig } from './nomalize-config';
import { RunnerResponse } from '../../../utils/types';
import chalk from 'chalk';

export const snowpackBuild = (
  options: NormalizedSnowpackBuildSchema
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
          build({
            config,
          })
            .then((buildResult) => {
              // buildResult.onFileChange
              subscriber.next({
                success: true,
              });
              !config.buildOptions.watch && subscriber.complete();
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
