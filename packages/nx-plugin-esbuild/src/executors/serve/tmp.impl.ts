import {
  runExecutor,
  stripIndents,
  parseTargetString,
  ExecutorContext,
  logger,
  readTargetOptions,
} from '@nrwl/devkit';

import { ChildProcess, fork } from 'child_process';
import { promisify } from 'util';
import treeKill from 'tree-kill';

import { ESBuildBuildEvent } from '../build/build.impl';
import { ESBuildRunnerOptions } from '../build/lib/types';

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();
} catch (e) {
  console.log('e: ', e);
}

export const enum InspectType {
  Inspect = 'inspect',
  InspectBrk = 'inspect-brk',
}

export interface ESBuildServeOptions {
  inspect: boolean | InspectType;
  runtimeArgs: string[];
  args: string[];
  waitUntilTargets: string[];
  buildTarget: string;
  host: string;
  port: number;
  watch: boolean;
}

let subProcess: ChildProcess = null;

export async function* executeExecutor(
  options: ESBuildServeOptions,
  context: ExecutorContext
) {
  if (options.waitUntilTargets && options.waitUntilTargets.length > 0) {
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
    await handleBuildEvent(event, options);
    yield event;
  }
}

function runProcess(event: ESBuildBuildEvent, options: ESBuildServeOptions) {
  if (subProcess || !event.success) {
    return;
  }

  subProcess = fork(event.outfile, options.args, {
    execArgv: getExecArgv(options),
  });
}

function getExecArgv(options: ESBuildServeOptions) {
  const args = ['-r', 'source-map-support/register', ...options.runtimeArgs];

  if (options.inspect === true) {
    options.inspect = InspectType.Inspect;
  }

  if (options.inspect) {
    args.push(`--${options.inspect}=${options.host}:${options.port}`);
  }

  return args;
}

async function handleBuildEvent(
  event: ESBuildBuildEvent,
  options: ESBuildServeOptions
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

// 前置钩子不需要包含build 因为这里本来就会执行一次build
async function* startBuild(
  options: ESBuildServeOptions,
  context: ExecutorContext
) {
  const buildTarget = parseTargetString(options.buildTarget);
  const buildOptions = readTargetOptions<ESBuildRunnerOptions>(
    buildTarget,
    context
  );
  // if (buildOptions.optimization) {
  //   logger.warn(stripIndents`
  //           ************************************************
  //           This is a simple process manager for use in
  //           testing or debugging Node applications locally.
  //           DO NOT USE IT FOR PRODUCTION!
  //           You should look into proper means of deploying
  //           your node application to production.
  //           ************************************************`);
  // }

  yield* await runExecutor<ESBuildBuildEvent>(
    buildTarget,
    {
      watch: options.watch,
    },
    context
  );
}

// 使用runExecutor方法不断执行
function runWaitUntilTargets(
  options: ESBuildServeOptions,
  context: ExecutorContext
): Promise<{ success: boolean }[]> {
  return Promise.all(
    options.waitUntilTargets.map(async (waitUntilTarget) => {
      const target = parseTargetString(waitUntilTarget);
      console.log('target: ', target);
      const output = await runExecutor(target, {}, context);
      // eslint-disable-next-line no-async-promise-executor
      return new Promise<{ success: boolean }>(async (resolve) => {
        // resolve完继续执行，还会不断更新吗？
        let event = await output.next();
        // Resolve after first event
        resolve(event.value as { success: boolean });

        // Continue iterating
        while (!event.done) {
          event = await output.next();
        }
      });
    })
  );
}

export default executeExecutor;
