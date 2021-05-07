import execa from 'execa';
import { from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';

export const startExeca = (tsConfig: string, main: string) => {
  return from(
    execa('ts-node-dev', ['--respawn', '-P', tsConfig, main], {
      stdio: 'inherit',
      preferLocal: true,
    })
  );
};
