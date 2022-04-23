import type { Target, ExecutorContext } from '@nrwl/devkit';

import { Workspaces } from '@nrwl/tao/src/shared/workspace';
import { combineOptionsForExecutor } from 'nx/src/utils/params';

/**
 * forked from @nrwl/devkit
 *
 * Reads and combines options for a given target.
 * Works as if you invoked the target yourself without passing any command lint overrides.
 */
export function readTargetOptions(
  { project, target, configuration }: Target,
  context: ExecutorContext
) {
  const projectConfiguration = context.workspace.projects[project];
  const targetConfiguration = projectConfiguration.targets[target];

  const ws = new Workspaces(context.root);
  const [nodeModule, executorName] = targetConfiguration.executor.split(':');
  const { schema } = ws.readExecutor(nodeModule, executorName);

  const defaultProject = ws.calculateDefaultProjectName(
    context.cwd,
    context.workspace
  );

  return combineOptionsForExecutor(
    {},
    configuration ?? '',
    targetConfiguration,
    schema,
    defaultProject,
    ws.relativeCwd(context.cwd)
  );
}
