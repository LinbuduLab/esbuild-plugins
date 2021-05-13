import { VitepressBuildSchema, Res } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { map } from 'rxjs/operators';
import { startVitePressBuild } from './lib/vitepress-build';

export default function runExecutor(schema: VitepressBuildSchema) {
  return eachValueFrom(
    startVitePressBuild(schema).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
