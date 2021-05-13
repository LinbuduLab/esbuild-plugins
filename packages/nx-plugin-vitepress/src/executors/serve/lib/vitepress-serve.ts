import { VitepressServeSchema, Res } from '../schema';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { serve } from 'vitepress';

export const startVitePressServe = (
  schema: VitepressServeSchema
): Observable<Res> => {
  return new Observable((subscriber) => {
    from(serve({ root: schema.root })).pipe(
      tap(() => {
        subscriber.next({
          success: true,
        });
      })
    );
  });
};
