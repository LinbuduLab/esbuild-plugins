import { ViteBuildSchema, Res } from '../schema';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { build } from 'vite';

export const startViteBuild = (schema: ViteBuildSchema): Observable<Res> => {
  return new Observable((subscriber) => {
    from(
      build({
        configFile: schema.configFile,
        root: schema.root,
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
