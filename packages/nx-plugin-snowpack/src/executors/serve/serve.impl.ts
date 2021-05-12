import { ExecutorContext } from '@nrwl/devkit';
import { SnowpackServeSchema } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { map, tap } from 'rxjs/operators';
import { SnowpackConfig } from 'snowpack';
import path from 'path';
import fs from 'fs-extra';
import { startServe } from './lib/start-serve';

export default function runExecutor(
  options: SnowpackServeSchema,
  context: ExecutorContext
) {
  return eachValueFrom(
    startServe(options).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
