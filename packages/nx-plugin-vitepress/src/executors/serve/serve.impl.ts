import { VitepressServeSchema } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { map } from 'rxjs/operators';
import { startVitePressServe } from './lib/vitepress-serve';

export default  function runExecutor(schema: VitepressServeSchema) {
  return eachValueFrom(
    startVitePressServe(schema).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
