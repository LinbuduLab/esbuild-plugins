import { Tree } from '@nrwl/devkit';
import { readNxJsonInTree, readWorkspaceJson } from '@nrwl/workspace';

/**
 * Check does project exist in current workspace
 * @param project
 * @returns
 */
export function checkProjectExist(project: string) {
  const workspaceConfig = readWorkspaceJson();

  const currentProjects = Object.keys(workspaceConfig.projects);

  return currentProjects.includes(project);
}
