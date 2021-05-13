import { VitepressBuildSchema, Res } from '../schema';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { build } from 'vitepress';

export const startVitePressBuild = (
  schema: VitepressBuildSchema
): Observable<Res> => {
  return new Observable((subscriber) => {
    from(build(schema.root, {})).pipe(
      tap(() => {
        subscriber.next({
          success: true,
        });
      })
    );
  });
};
