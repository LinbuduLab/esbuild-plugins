import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { startServer, clearCache } from 'snowpack';

import { loadSnowpackConfig, createSnowpackConfig } from './nomalize-config';
import { NormalizedSnowpackServeSchema } from '../schema';
import { RunnerResponse } from '../../../utils/types';

export const snowpackServer = (
  options: NormalizedSnowpackServeSchema
): Observable<RunnerResponse> => {
  const resolvedConfig = options.configPath
    ? loadSnowpackConfig(options)
    : of(createSnowpackConfig(options));

  return from(resolvedConfig).pipe(
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
