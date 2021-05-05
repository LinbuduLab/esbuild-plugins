import { logger } from '@nrwl/devkit';
import { ChildProcess, fork } from 'child_process';
import { promisify } from 'util';

import { BuildExecutorEvent } from '../../../utils';

import treeKill from 'tree-kill';
import { NormalizedNodeServeExecutorSchema } from '../schema';

export function runProcess(
  event: BuildExecutorEvent,
  options: NormalizedNodeServeExecutorSchema,
  subProcess: ChildProcess
) {
  if (subProcess || !event.success) {
    return;
  }

  subProcess = fork(event.outfile, options.args, {
    execArgv: options.execArgs,
  });
}

export async function killProcess(subProcess: ChildProcess) {
  if (!subProcess) {
    return;
  }

  const promisifiedTreeKill: (
    pid: number,
    signal: string
  ) => Promise<void> = promisify(treeKill);
  try {
    await promisifiedTreeKill(subProcess.pid, 'SIGTERM');
  } catch (err) {
    if (Array.isArray(err) && err[0] && err[2]) {
      const errorMessage = err[2];
      logger.error(errorMessage);
    } else if (err.message) {
      logger.error(err.message);
    }
  } finally {
    subProcess = null;
  }
}
