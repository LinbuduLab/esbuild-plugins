import {
  runExecutor,
  parseTargetString,
  ExecutorContext,
  readTargetOptions,
} from '@nrwl/devkit';

import { BuildExecutorEvent } from '../../../utils';
import { NodeServeExecutorSchema } from '../schema';

// 前置钩子不需要包含build 因为这里本来就会执行一次build
export async function* startBuild(
  options: NodeServeExecutorSchema,
  context: ExecutorContext
) {
  const buildTarget = parseTargetString(options.buildTarget);
  // const buildOptions = readTargetOptions(
  //   buildTarget,
  //   context
  // );

  // TODO: build executor optimization options
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

  yield* await runExecutor<BuildExecutorEvent>(
    buildTarget,
    {
      watch: options.watch,
    },
    context
  );
}
