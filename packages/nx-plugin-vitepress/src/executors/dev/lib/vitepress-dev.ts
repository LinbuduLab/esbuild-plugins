import { NormalizedVitepressDevSchema } from '../schema';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { createServer } from 'vitepress';
import { Res } from '../../../utils/types';

export const startVitePressDev = (
  schema: NormalizedVitepressDevSchema
): Observable<Res> => {
  return new Observable((subscriber) => {
    createServer(schema.root, schema.serverOptions).then((server) => {
      from(server.listen()).pipe(
        tap(() => {
          subscriber.next({
            success: true,
          });
        })
      );
    });
  });
};
