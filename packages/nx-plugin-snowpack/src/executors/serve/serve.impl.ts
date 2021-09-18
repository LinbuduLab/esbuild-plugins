import { ExecutorContext } from '@nrwl/devkit';
import { SnowpackServeSchema } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { map } from 'rxjs/operators';
import { logger } from 'snowpack';
import { snowpackServer } from './lib/snowpack-server';
import { normalizeSchema } from './lib/normalize-schema';

export default function runExecutor(
  options: SnowpackServeSchema,
  context: ExecutorContext
) {
  const normalizedSchema = normalizeSchema(options, context);
  logger.level = normalizedSchema.verbose ? 'debug' : 'info';

  return eachValueFrom(
    snowpackServer(normalizedSchema).pipe(map((res) => res))
  );
}
