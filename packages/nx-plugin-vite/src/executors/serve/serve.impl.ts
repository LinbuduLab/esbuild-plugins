import type { ExecutorContext } from '@nrwl/devkit';
import type { ViteServeSchema } from './schema';

import { eachValueFrom } from 'rxjs-for-await';
import { catchError, map } from 'rxjs/operators';
import consola from 'consola';

import { startViteServer } from './lib/vite-serve';
import { preflightCheck } from '../utils/preflight-check';
import { of } from 'rxjs';

export default function runExecutor(
  schema: ViteServeSchema,
  context: ExecutorContext
) {
  preflightCheck(context, schema.configFile);

  schema.root =
    schema.root ?? context.workspace.projects[context.projectName].root;

  return eachValueFrom(
    startViteServer(schema).pipe(
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
