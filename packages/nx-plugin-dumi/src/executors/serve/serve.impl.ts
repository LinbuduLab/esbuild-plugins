import { DumiServeSchema } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { tap, map } from 'rxjs/operators';
import dumiServe from './lib/dumi-serve';

export default function runExecutor(options: DumiServeSchema) {
  return eachValueFrom(
    dumiServe(options.cwd).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
