import { VuePressBuildSchema, Res } from '../schema';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { build, allowTs } from 'vuepress';

export const startVuePressBuild = (
  schema: VuePressBuildSchema
): Observable<Res> => {
  return new Observable((subscriber) => {
    // allow .vuepress/config.ts
    allowTs();

    from(
      build(schema.root, {
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
