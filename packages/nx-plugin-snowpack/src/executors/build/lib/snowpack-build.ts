import { NormalizedSnowpackBuildSchema } from '../schema';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { build, clearCache } from 'snowpack';
import { loadSnowpackConfig, createSnowpackConfig } from './nomalize-config';
import { RunnerResponse } from '../../../utils/types';

export const snowpackBuild = (
  options: NormalizedSnowpackBuildSchema
): Observable<RunnerResponse> => {
  return new Observable<RunnerResponse>((subscriber) => {
    (options.clearCache ? clearCache() : Promise.resolve()).then(() => {
      loadSnowpackConfig(options)
        .then((config) => {
          console.log('config: ', config);
          from(build({ config })).pipe(
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

    //  from(build({ config: createSnowpackConfig(options) })).pipe(
    //     tap((buildResult) =>
    //       subscriber.next({
    //         success: true,
    //       })
    //     )
    //   );
  });
};
