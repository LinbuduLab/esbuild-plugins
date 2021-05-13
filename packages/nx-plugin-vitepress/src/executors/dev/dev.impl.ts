import { VitepressDevSchema } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { map } from 'rxjs/operators';
import { startVitePressDev } from './lib/vitepress-dev';

export default function runExecutor(schema: VitepressDevSchema) {
  return eachValueFrom(
    startVitePressDev(schema).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
