import { VuePressBuildSchema, Res } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { map } from 'rxjs/operators';
import { startVuePressBuild } from './lib/vuepress-build';

export default function runExecutor(schema: VuePressBuildSchema) {
  return eachValueFrom(
    startVuePressBuild(schema).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
