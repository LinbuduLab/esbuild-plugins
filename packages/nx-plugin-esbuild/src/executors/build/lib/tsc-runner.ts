import { Observable } from 'rxjs';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import { error, info, success, plainText } from './log';

import type { TscRunnerOptions, TscRunnerResponse } from './types';

export function runTSC({ tsconfigPath, watch, root }: TscRunnerOptions) {
  return new Observable<TscRunnerResponse>((subscriber) => {
    const tscBinPath = path.join(root, 'node_modules', '.bin', 'tsc');

    // TODO: if tsc is not found in project directory, check global
    if (!fs.existsSync(tscBinPath)) {
      console.log(
        `${error(`tsc is not found in ${tscBinPath}, run`)} ${info(
          'npm intsall typescript'
        )} ${error('to retry')}`
      );
    }

    const args: string[] = ['--noEmit', '--pretty'];

    if (watch) {
      args.push('-w');
    }

    args.push(`-p ${tsconfigPath}`);

    let errorCount = 0;
    const childProcess = spawn(tscBinPath, args, {
      // set shell to be true, or add suffix '.cmd'/".exe"/".bat" in Windows
      shell: true,
      stdio: 'pipe',
    });

    childProcess.stdout.on('data', (data) => {
      const decoded = data.toString();
      console.log('decoded: ', decoded);
      // eslint-disable-next-line no-control-regex
      if (decoded.match(/\x1Bc/g)) return;
      if (decoded.includes('error TS')) {
        errorCount++;
        subscriber.next({ error: decoded });
      } else {
        subscriber.next({ info: decoded });
      }
    });

    childProcess.stderr.on('error', (tscError) => {
      subscriber.next({ tscError });
    });

    childProcess.stdout.on('end', () => {
      subscriber.next({
        info: `Type check complete. Found ${errorCount} errors`,
      });
    });
  });
}
