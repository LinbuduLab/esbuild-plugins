import { ExecutorContext, parseTargetString } from '@nrwl/devkit';
import { InspectType } from '../../../utils';
import {
  NodeServeExecutorSchema,
  NormalizedNodeServeExecutorSchema,
} from '../schema';

export function normalizeServeExecutorOptions(
  options: NodeServeExecutorSchema,
  context: ExecutorContext
): NormalizedNodeServeExecutorSchema {
  const { targets } = context.workspace.projects[context.projectName];

  const projectTargets = Object.keys(targets);

  // TODO: different project target？
  const specifiedBuildTarget = parseTargetString(options.buildTarget).target;

  if (!projectTargets.includes(specifiedBuildTarget)) {
    throw new Error(
      `target [${specifiedBuildTarget}] does not exist in [${context.projectName}] targets.`
    );
  }

  const existWaitUntilTargets = options.waitUntilTargets.filter((waitTarget) =>
    projectTargets.includes(waitTarget)
  );

  const execArgs = [
    '-r',
    'source-map-support/register',
    ...options.runtimeArgs,
  ];

  if (options.inspect === true) {
    options.inspect = InspectType.Inspect;
  }

  if (options.inspect) {
    execArgs.push(`--${options.inspect}=${options.host}:${options.port}`);
  }

  return {
    ...options,
    execArgs,
    waitUntilTargets: existWaitUntilTargets,
  };
}
