import { ServeExecutorSchema } from '../schema';
import getBuiltInPlugins from 'ice.js/lib/getBuiltInPlugins';
import { start } from '@alib/build-scripts';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';
import execa from 'execa';

interface Res {
  success: boolean;
}

const serveCommands = (options: ServeExecutorSchema): string[] => {
  const commands = ['start'];

  return commands;
};

export const startServe = (options: ServeExecutorSchema): Observable<Res> => {
  return new Observable((subscriber) => {
    execa('icejs', serveCommands(options), {
      cwd: options.root,
      stdio: 'inherit',
      preferLocal: true,
    }).then(() => {
      subscriber.next({
        success: true,
      });
    });
  });
};
