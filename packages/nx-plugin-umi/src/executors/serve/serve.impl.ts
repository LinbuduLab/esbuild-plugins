import { map, switchMap, tap } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';
import { startUmiServe } from '../utils/start-umi-serve';

export default function runExecutor(options: any) {
  return eachValueFrom(
    startUmiServe(options.cwd).pipe(
      tap((x) => {}),
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
