import { ExecutorContext } from '@nrwl/devkit';
import {
  LightNodeServeExecutorSchema,
  NormalizedLightNodeServeExecutorSchema,
} from './schema';
import { from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';

import { startExeca } from './lib/execa';

export default function runExecutor(
  options: NormalizedLightNodeServeExecutorSchema,
  context: ExecutorContext
) {
  const { main, tsConfig } = options;

  return eachValueFrom(
    startExeca(tsConfig, main).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
