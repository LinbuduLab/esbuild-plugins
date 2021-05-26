import { BuildExecutorSchema } from './schema';
import getBuiltInPlugins from 'ice.js/lib/getBuiltInPlugins';
import { start } from '@alib/build-scripts';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';
import { startBuild } from './lib/start-build';

export default function runExecutor(options: BuildExecutorSchema) {
  return eachValueFrom(
    startBuild(options).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
