import { ExecutorContext } from '@nrwl/devkit';
import { SnowpackServeSchema } from '../schema';
import { from, Observable } from 'rxjs';
import { eachValueFrom } from 'rxjs-for-await';
import { map, tap, switchMap } from 'rxjs/operators';
import {
  createConfiguration,
  loadConfiguration,
  startServer,
  build,
  SnowpackConfig,
  SnowpackUserConfig,
} from 'snowpack';
import { loadSnowpackConfig, createSnowpackConfig } from './nomalize';

export interface Tmp {
  success: boolean;
}

export const startServe = (
  options: SnowpackServeSchema,
  loadedConfig?: SnowpackConfig
): Observable<Tmp> => {
  return new Observable<Tmp>((subscriber) => {
    const config = createSnowpackConfig(options);

    from(startServer({ config })).pipe(
      tap((buildResult) =>
        subscriber.next({
          success: true,
        })
      )
    );
  });
};
