import { ExecutorContext } from '@nrwl/devkit';
import { SnowpackBuildSchema } from '../schema';
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
import { all as merge } from 'deepmerge';
import { isPlainObject } from '../../../utils/is-plain-object';

export interface Tmp {
  success: boolean;
}

export const builder = (
  options: SnowpackBuildSchema,
  loadedConfig?: SnowpackConfig
): Observable<Tmp> => {
  return new Observable<Tmp>((subscriber) => {
    const config = createSnowpackConfig(options);

    from(build({ config })).pipe(
      tap((buildResult) =>
        subscriber.next({
          success: true,
        })
      )
    );
  });
};
