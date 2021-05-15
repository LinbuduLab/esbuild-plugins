import { VitepressServeSchema } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { map } from 'rxjs/operators';
import { startVitePressServe } from './lib/vitepress-serve';
import { Res } from '../../utils/types';

export default function runExecutor(schema: VitepressServeSchema) {
  return eachValueFrom<Res>(
    startVitePressServe(schema).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
