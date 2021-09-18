import { ExecutorContext, parseTargetString } from '@nrwl/devkit';

import type {
  ESBuildInfoExecutorSchema,
  NormalizedESBuildInfoExecutorSchema,
} from '../schema';

export function normalizeInfoExecutorSchema(
  options: ESBuildInfoExecutorSchema,
  context: ExecutorContext
): NormalizedESBuildInfoExecutorSchema {
  const { targets } = context.workspace.projects[context.projectName];
  const projectTargets = Object.keys(targets);
  const {
    buildTarget = `${context.projectName}:build`,
    serveTarget = `${context.projectName}:serve`,
  } = options;

  const buildTargetName = parseTargetString(buildTarget).target;
  const serveTargetName = parseTargetString(serveTarget).target;

  if (!projectTargets.includes(buildTargetName)) {
    throw new Error(
      `Build target ${buildTargetName} does not exist in targets of ${context.projectName}`
    );
  }

  if (!projectTargets.includes(serveTargetName)) {
    throw new Error(
      `Serve target ${buildTargetName} does not exist in targets of ${context.projectName}`
    );
  }

  return {
    buildTarget,
    serveTarget,
  };
}
