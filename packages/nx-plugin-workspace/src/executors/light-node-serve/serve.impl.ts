import { ExecutorContext } from '@nrwl/devkit';
import { NormalizedLightNodeServeExecutorSchema } from './schema';
import { from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';

import { startExeca } from './lib/execa';

export default function runExecutor(
  options: NormalizedLightNodeServeExecutorSchema,
  context: ExecutorContext
) {
  return eachValueFrom(
    startExeca(options).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
