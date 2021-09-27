import execa, { Options, SyncOptions } from 'execa';
import { Observable } from 'rxjs';
// import {} from 'rxjs/operators';

export function executeFromCLICommand(
  command: string,
  subCommand: string,
  composedCommandArgs: string,
  execaOptions: Options
) {
  return new Observable((subscriber) => {
    execa(command, [subCommand, composedCommandArgs], {
      stdio: 'inherit',
      preferLocal: true,
      ...execaOptions,
    })
      .then((e) => {
        subscriber.next({
          success: true,
        });
      })
      .catch((error) => {
        subscriber.error({
          success: false,
          error,
        });
      });
  });
}

export function executeFromCLISync(
  command: string,
  subCommand: string,
  composedCommandArgs: string,
  execaOptions: SyncOptions
) {
  execa.sync(command, [subCommand, composedCommandArgs], {
    stdio: 'inherit',
    preferLocal: true,
    ...execaOptions,
  });
}
