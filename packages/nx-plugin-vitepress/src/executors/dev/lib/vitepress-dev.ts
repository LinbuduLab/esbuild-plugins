import { VitepressDevSchema, Res } from '../schema';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { createServer } from 'vitepress';

export const startVitePressDev = (
  schema: VitepressDevSchema
): Observable<Res> => {
  return new Observable((subscriber) => {
    createServer(schema.root).then((server) => {
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
