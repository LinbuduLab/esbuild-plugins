import { ExecutorContext } from '@nrwl/devkit';
import { NormalizedLightNodeServeExecutorSchema } from './schema';
import { map } from 'rxjs/operators';
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
