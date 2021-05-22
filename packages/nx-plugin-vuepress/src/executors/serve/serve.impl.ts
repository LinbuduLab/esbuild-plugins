import { VuePressServeSchema } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { map } from 'rxjs/operators';
import { startVuePressServe } from './lib/vuepress-serve';

export default function runExecutor(schema: VuePressServeSchema) {
  return eachValueFrom(
    startVuePressServe(schema).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
