import { readWorkspaceConfig } from 'nx/src/project-graph/file-utils';
import { workspaceRoot } from '@nrwl/devkit';

/**
 * Check does project exist in current workspace
 * @param project
 * @returns
 */
export function checkProjectExist(project: string) {
  const workspaceConfig = readWorkspaceConfig({
    format: 'nx',
    path: workspaceRoot,
  });

  const currentProjects = Object.keys(workspaceConfig.projects);

  return currentProjects.includes(project);
}
