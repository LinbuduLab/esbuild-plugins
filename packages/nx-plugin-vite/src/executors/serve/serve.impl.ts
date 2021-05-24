import { ViteServeSchema, Res } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { of, Observable } from 'rxjs';
import { map, mapTo, tap, catchError } from 'rxjs/operators';

import { startViteServer, ServeRes } from './lib/vite-serve';

export default function runExecutor(
  schema: ViteServeSchema
): AsyncIterableIterator<Res> {
  return eachValueFrom(
    startViteServer(schema).pipe(
      tap((x) => {}),

      catchError<ServeRes, Observable<Res>>((err) =>
        of({
          success: false,
        })
      ),
      map((res) => res)
    )
  );
}
