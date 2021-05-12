import { ExecutorContext } from '@nrwl/devkit';
import { SnowpackBuildSchema } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { map } from 'rxjs/operators';
import { logger, LoggerLevel } from 'snowpack';

import { snowpackBuild } from './lib/snowpack-build';
import { normalizeSchema } from './lib/normalize-schema';

export default function runExecutor(
  options: SnowpackBuildSchema,
  context: ExecutorContext
) {
  const normalizedSchema = normalizeSchema(options, context);
  console.log('normalizedSchema: ', normalizedSchema);
  logger.level = normalizedSchema.verbose ? 'debug' : 'info';

  return eachValueFrom(
    snowpackBuild(normalizedSchema).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
