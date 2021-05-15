import { VitepressServeSchema } from '../schema';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { serve } from 'vitepress';
import { Res } from '../../../utils/types';

export const startVitePressServe = (
  schema: VitepressServeSchema
): Observable<Res> => {
  return new Observable((subscriber) => {
    from(serve({ root: schema.root, port: schema.port })).pipe(
      tap(() => {
        subscriber.next({
          success: true,
        });
      })
    );
  });
};
