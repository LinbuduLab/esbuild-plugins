import { ServeExecutorSchema } from '../schema';
import getBuiltInPlugins from 'ice.js/lib/getBuiltInPlugins';
import { start } from '@alib/build-scripts';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';
import execa from 'execa';
import kebabCase from 'lodash/kebabCase';

interface Res {
  success: boolean;
}

const serveCommands = (options: ServeExecutorSchema): string[] => {
  const commands = ['start'];

  const { root, ...cliArgs } = options;

  // const shouldAppendNewArgs = Object.keys(cliArgs).some(
  //   (argKey) => cliArgs[argKey] === true
  // );

  // if (shouldAppendNewArgs) {
  //   commands.push('--');
  // }

  for (const [k, v] of Object.entries(cliArgs)) {
    if (v) {
      commands.push(`--${kebabCase(k)}=${v}`);
    }
  }
  console.log(commands);

  return commands;
};

export const startServe = (options: ServeExecutorSchema): Observable<Res> => {
  return new Observable((subscriber) => {
    //
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
