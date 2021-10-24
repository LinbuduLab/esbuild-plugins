import type { ExecutorContext } from '@nrwl/devkit';
import type { ViteServeSchema } from './schema';

import { of } from 'rxjs';
import { eachValueFrom } from 'rxjs-for-await';
import { catchError, map } from 'rxjs/operators';
import consola from 'consola';

import { startViteAsync, startViteServer } from './lib/vite-serve';
import { preflightCheck } from '../utils/preflight-check';

export default async function runExecutor(
  schema: ViteServeSchema,
  context: ExecutorContext
) {
  preflightCheck(context, schema.configFile);

  schema.root =
    schema.root ?? context.workspace.projects[context.projectName].root;

  // return eachValueFrom(
  //   startViteServer(schema).pipe(
  //     catchError((err, caught) => {
  //       consola.error(err);
  //       return of({
  //         success: false,
  //       });
  //     }),
  //     map((res) => res)
  //   )
  // );
  return await startViteAsync(schema);
}
