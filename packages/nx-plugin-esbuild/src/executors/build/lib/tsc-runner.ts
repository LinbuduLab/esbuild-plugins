import { Observable } from 'rxjs';
import { spawn } from 'child_process';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import { error, info, success, plainText } from './log';
import execa from 'execa';

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

    // --pretty
    const args: string[] = ['--noEmit'];

    if (watch) {
      args.push('-w');
    }

    args.push(`-p ${tsconfigPath}`);

    // const errorSig = '\x1B[91merror\x1B[0m\x1B[90m';
    const errorSig = 'error TS';

    let errorCount = 0;
    const childProcess = execa(tscBinPath, args, {
      // set shell to be true, or add suffix '.cmd'/".exe"/".bat" in Windows
      shell: true,
      // child_process.stdio.pipe(sub_process)
      stdio: 'pipe',
    });

    // 如果直接使用tsc的stdout，那么在非watch

    childProcess.stdout.on('data', (data: Buffer) => {
      // console.log('Data emit from stdout');
      const decoded = data.toString();

      // skip empty emit
      // eslint-disable-next-line no-control-regex
      if (decoded.match(/\x1Bc/g)) return;

      // e.g. apps/nest-app/src/main.ts:22:20 - error TS2769:
      // 启用pretty时 将无法使用这个方式匹配
      if (decoded.includes(errorSig)) {
        errorCount++;
        subscriber.next({ error: decoded });
      } else {
        subscriber.next({ info: decoded });
      }
    });

    // TODO: check by add unknown options to tsc
    // childProcess.stderr.on('error', (tscError) => {
    //   console.log('Error emit from stderr');
    //   subscriber.next({ tscError });
    //   console.log('=== Data emit from stderr END ===');
    // });

    // only triggered when options.watch false
    childProcess.stdout.on('end', () => {
      subscriber.next({
        info: `Type check complete. Found ${errorCount} errors`,
      });
    });
  });
}
