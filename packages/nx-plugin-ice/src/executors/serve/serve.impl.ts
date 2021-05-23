import { ServeExecutorSchema } from './schema';
import getBuiltInPlugins from 'ice.js/lib/getBuiltInPlugins';
import { start } from '@alib/build-scripts';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';

interface Res {
  success: boolean;
}

const startIce = (options: ServeExecutorSchema): Observable<Res> => {
  return new Observable<Res>((subscriber) => {
    start({
      args: {},
      getBuiltInPlugins,
      rootDir: options.root,
    }).then(() => {
      subscriber.next({
        success: true,
      });
    });
  });
};

// 重点在于把启动流程插入到哪个位置
export default function runExecutor(options: ServeExecutorSchema) {
  return eachValueFrom(
    startIce(options).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
