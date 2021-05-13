import { VuePressServeSchema, Res } from '../schema';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { dev, allowTs } from 'vuepress';

export const startVuePressServe = (
  schema: VuePressServeSchema
): Observable<Res> => {
  allowTs();

  return new Observable((subscriber) => {
    from(
      dev(schema.root, {
        config: schema.configPath,
      })
    ).pipe(
      tap(() => {
        subscriber.next({
          success: true,
        });
      })
    );
  });
};
