import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { startServer } from 'snowpack';

import { loadSnowpackConfig } from './nomalize-config';
import { NormalizedSnowpackServeSchema } from '../schema';
import { RunnerResponse } from '../../../utils/types';

export const snowpackServer = (
  options: NormalizedSnowpackServeSchema
): Observable<RunnerResponse> => {
  return new Observable<RunnerResponse>((subscriber) => {
    loadSnowpackConfig(options)
      .then((config) => {
        from(startServer({ config })).pipe(
          tap((buildResult) =>
            subscriber.next({
              success: true,
            })
          )
        );
      })
      .catch((error) => {
        subscriber.error({
          success: false,
        });
      });
  });
};
