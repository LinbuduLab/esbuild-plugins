import { ViteBuildSchema, Res } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { map } from 'rxjs/operators';
import { startViteBuild } from './lib/vite-build';

export default function runExecutor(schema: ViteBuildSchema) {
  return eachValueFrom(
    startViteBuild(schema).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
