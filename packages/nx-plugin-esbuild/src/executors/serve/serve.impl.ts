import { ExecutorContext, logger } from '@nrwl/devkit';

import { ChildProcess, fork } from 'child_process';
import { promisify } from 'util';
import treeKill from 'tree-kill';

import { ESBuildBuildEvent } from '../build/lib/types';

import {
  ESBuildServeExecutorSchema,
  NormalizedESBuildServeExecutorSchema,
} from './schema';

import { normalizeServeExecutorOptions } from './lib/normalize-schema';
import { startBuild } from './lib/start-build';
import { runWaitUntilTargets } from './lib/wait-until-targets';
import dotenv from 'dotenv';

dotenv.config();

let subProcess: ChildProcess = null;

export async function* executeExecutor(
  options: ESBuildServeExecutorSchema,
  context: ExecutorContext
) {
  const normalizedOptions = normalizeServeExecutorOptions(options, context);

  if (
    normalizedOptions.waitUntilTargets &&
    normalizedOptions.waitUntilTargets.length > 0
  ) {
    // 确保前置target执行完毕
    const results = await runWaitUntilTargets(options, context);
    for (const [i, result] of results.entries()) {
      if (!result.success) {
        console.log('throw');
        throw new Error(
          `Wait until target failed: ${options.waitUntilTargets[i]}.`
        );
      }
    }
  }

  for await (const event of startBuild(options, context)) {
    if (!event.success) {
      logger.error('There was an error with the build. See above.');
      logger.info(`${event.outfile} was not restarted.`);
    }
    await handleBuildEvent(event, normalizedOptions);
    yield event;
  }
}

function runProcess(
  event: ESBuildBuildEvent,
  options: NormalizedESBuildServeExecutorSchema
) {
  if (subProcess || !event.success) {
    return;
  }

  subProcess = fork(event.outfile, options.args, {
    execArgv: options.execArgs,
  });
}

async function handleBuildEvent(
  event: ESBuildBuildEvent,
  options: NormalizedESBuildServeExecutorSchema
) {
  if ((!event.success || options.watch) && subProcess) {
    await killProcess();
  }
  runProcess(event, options);
}

async function killProcess() {
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

export default executeExecutor;
