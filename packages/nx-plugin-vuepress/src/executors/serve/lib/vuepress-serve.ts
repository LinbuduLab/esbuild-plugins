import { VuePressServeSchema } from '../schema';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { dev, allowTs } from 'vuepress';
import execa from 'execa';
import { Res } from '../../utils/types';

const devCommands = (schema: VuePressServeSchema): string[] => {
  const commands = [
    'dev',
    schema.docsDir,
    schema.cleanCache && '--clean-cache',
    schema.cleanTemp && '--clean-temp',
    schema.open && '--open',
    schema.debug && '--debug',
    schema.noWatch && '--no-watch',
    schema.temp && `--temp ${schema.temp}`,
    schema.cache && `--cache ${schema.cache}`,
  ].filter(Boolean);

  commands.push('--config', schema.configPath);
  commands.push('--host', schema.host);
  commands.push('--port', schema.port.toString());

  return commands;
};

export const startVuePressServe = (
  schema: VuePressServeSchema
): Observable<Res> => {
  allowTs();

  return new Observable((subscriber) => {
    execa('vuepress', devCommands(schema), {
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

  // programmatic usage doesn't work correctly
  // so let's use CLI for a tmp replacement
  // return new Observable((subscriber) => {
  //   from(
  //     dev(schema.root, {
  //       config: schema.configPath,
  //     })
  //   ).pipe(
  //     tap(() => {
  //       subscriber.next({
  //         success: true,
  //       });
  //     })
  //   );
  // });
};
