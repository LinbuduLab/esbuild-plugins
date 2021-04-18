import {
  Tree,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';

import { BasicNormalizedAppGenSchema } from './shared-schema';

export function setDefaultProject<T extends BasicNormalizedAppGenSchema>(
  host: Tree,
  schema: T
): void {
  const workspace = readWorkspaceConfiguration(host);

  if (!workspace.defaultProject) {
    workspace.defaultProject = schema.projectRoot;
    updateWorkspaceConfiguration(host, workspace);
  }
}
