import {
  Tree,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';

import { NormalizedInitSchema } from '../schema';

export function updateWorkspace(host: Tree, schema: NormalizedInitSchema) {
  const { projectName } = schema;
  const workspace = readWorkspaceConfiguration(host);

  if (!workspace.defaultProject) {
    workspace.defaultProject = projectName;
  }

  workspace.generators = workspace.generators || {};
  workspace.generators['nx-plugin-vitepress:init'] = {};
  workspace.generators['nx-plugin-vitepress:setup'] = {};

  updateWorkspaceConfiguration(host, workspace);
}
