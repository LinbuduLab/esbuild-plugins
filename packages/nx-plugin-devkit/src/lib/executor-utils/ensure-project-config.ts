import { ExecutorContext } from '@nrwl/devkit';

/**
 * Ensure project has `projectSourceRoot` & `projectRoot` config field
 * @param context ExecutorContext
 */
export function ensureProjectConfig(context: ExecutorContext) {
  const { sourceRoot: projectSourceRoot, root: projectRoot } =
    context.workspace.projects[context.projectName];

  if (!projectSourceRoot) {
    throw new Error(`${context.projectName} does not have a sourceRoot.`);
  }

  if (!projectRoot) {
    throw new Error(`${context.projectName} does not have a root.`);
  }
}
