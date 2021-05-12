import { ExecutorContext } from '@nrwl/devkit';
import { SnowpackServeSchema } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { map } from 'rxjs/operators';
import { snowpackServer } from './lib/snowpack-server';
import { normalizeSchema } from './lib/normalize-schema';

export default function runExecutor(
  options: SnowpackServeSchema,
  context: ExecutorContext
) {
  const normalizedSchema = normalizeSchema(options, context);

  return eachValueFrom(
    snowpackServer(normalizedSchema).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
