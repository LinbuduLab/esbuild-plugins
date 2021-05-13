import { ViteServeSchema, Res } from '../schema';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { createServer } from 'vite';

export const startViteServer = (schema: ViteServeSchema): Observable<Res> => {
  return new Observable((subscriber) => {
    createServer({
      configFile: schema.configFile,
      root: schema.root,
    }).then((server) => {
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
