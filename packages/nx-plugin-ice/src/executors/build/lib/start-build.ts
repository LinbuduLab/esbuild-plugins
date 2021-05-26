import { BuildExecutorSchema } from '../schema';
import getBuiltInPlugins from 'ice.js/lib/getBuiltInPlugins';
import { start } from '@alib/build-scripts';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';
import execa from 'execa';
import kebabCase from 'lodash/kebabCase';
import { ExecutorRes } from '../../utils/types';

const buildCommands = (options: BuildExecutorSchema): string[] => {
  const commands = ['build'];

  const { root, ...cliArgs } = options;

  for (const [k, v] of Object.entries(cliArgs)) {
    if (v) {
      commands.push(`--${kebabCase(k)}=${v}`);
    }
  }
  console.log(commands);

  return commands;
};

export const startBuild = (
  options: BuildExecutorSchema
): Observable<ExecutorRes> => {
  return new Observable((subscriber) => {
    execa('icejs', buildCommands(options), {
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
