import { ServeExecutorSchema } from '../schema';
import getBuiltInPlugins from 'ice.js/lib/getBuiltInPlugins';
import { start } from '@alib/build-scripts';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';

interface Res {
  success: boolean;
}

// Not work yet...
export const startProgrammaticServe = (
  options: ServeExecutorSchema
): Observable<Res> => {
  console.log('options: ', options);
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
