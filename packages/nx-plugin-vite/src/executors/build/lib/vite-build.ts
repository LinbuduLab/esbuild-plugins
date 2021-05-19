import { ViteBuildSchema } from '../schema';
import { Res } from '../../utils/types';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { build } from 'vite';

export const startViteBuild = (schema: ViteBuildSchema): Observable<Res> => {
  return new Observable<Res>((subscriber) => {
    from(
      build({
        root: schema.root,
        configFile: schema.configFile,
        build: {
          watch: schema.watch ? {} : null,
          outDir: schema.outDir,
          write: schema.write,
        },
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
