import devServer from 'astro/dist/dev.js';
import { AstroConfig } from 'astro/dist/types/@types/config';
import { formatConfigError, loadConfig } from 'astro/dist/config.js';

import { ExecutorContext } from '@nrwl/devkit';
import { eachValueFrom } from 'rxjs-for-await';
import { catchError, map, tap } from 'rxjs/operators';
import { executeFromCLICommand } from 'nx-plugin-devkit';
import { Observable } from 'rxjs';
import { DevExecutorSchema } from './schema';

// export function astroDev(config: AstroConfig) {
//   return new Observable((subscriber) => {
//     devServer(config).then(() => {
//       subscriber.next({
//         success: true,
//       });
//     });
//   });
// }

export default async function runExecutor(
  options: DevExecutorSchema,
  context: ExecutorContext
) {
  return eachValueFrom(
    executeFromCLICommand('astro', 'dev', '', {
      cwd: options.projectRoot,
    }).pipe(
      tap((x) => {
        console.log(x);
      }),
      catchError((e, caught) => {
        console.log(e);
        return [
          {
            success: true,
          },
        ];
      }),
      map((res) => ({
        success: true,
      }))
    )
  );
}
