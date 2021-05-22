import { VuePressBuildSchema } from '../schema';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { build, allowTs } from 'vuepress';
import execa from 'execa';
import { Res } from '../../utils/types';

// vite as bundler ?

const buildCommands = (schema: VuePressBuildSchema): string[] => {
  const commands = [
    'build',
    schema.docsDir,
    schema.cleanCache && '--clean-cache',
    schema.cleanTemp && '--clean-temp',
    schema.debug && '--debug',
    // -d --debug --dest
    // schema.dest && `--dest ${schema.dest}`,
    schema.temp && `--temp ${schema.temp}`,
    schema.cache && `--cache ${schema.cache}`,
  ].filter(Boolean);

  commands.push('--config', schema.configPath);

  return commands;
};

export const startVuePressBuild = (
  schema: VuePressBuildSchema
): Observable<Res> => {
  return new Observable((subscriber) => {
    allowTs();

    execa('vuepress', buildCommands(schema), {
      cwd: schema.root,
      stdio: 'inherit',
      preferLocal: true,
    })
      .then(() => {
        subscriber.next({
          success: true,
        });
      })
      .catch(() => {
        subscriber.next({
          success: false,
        });
      });
  });

  // from(
  //   build(schema.root, {
  //     config: schema.configPath,
  //   })
  // ).pipe(
  //   tap(() => {
  //     subscriber.next({
  //       success: true,
  //     });
  //   })
  // );
};
