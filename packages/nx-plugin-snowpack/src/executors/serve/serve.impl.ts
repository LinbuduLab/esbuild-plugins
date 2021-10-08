import type { ExecutorContext } from '@nrwl/devkit';
import type { SnowpackServeSchema } from './schema';

import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';

import { logger } from 'snowpack';
import consola from 'consola';

import { snowpackServer } from './lib/snowpack-server';
import { normalizeSchema } from './lib/normalize-schema';

export default function runExecutor(
  options: SnowpackServeSchema,
  context: ExecutorContext
) {
  const normalizedSchema = normalizeSchema(options, context);
  logger.level = normalizedSchema.verbose ? 'debug' : 'info';

  return eachValueFrom(
    snowpackServer(normalizedSchema).pipe(
      catchError((err, caught) => {
        consola.error(err);
        return of({
          success: false,
        });
      }),
      map((res) => res)
    )
  );
}
