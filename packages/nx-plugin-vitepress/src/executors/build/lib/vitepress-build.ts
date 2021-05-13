import { NormalizedVitepressBuildSchema } from '../schema';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { build } from 'vitepress';

import { Res } from '../../../utils/types';

export const startVitePressBuild = (
  schema: NormalizedVitepressBuildSchema
): Observable<Res> => {
  return new Observable<Res>((subscriber) => {
    from(
      build(schema.root, {
        ...schema.buildOptions,
        // FIXME: enable watch will cause error
        watch: null,
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
