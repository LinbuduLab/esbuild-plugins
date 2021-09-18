import {
  Tree,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';

import { BasicNormalizedAppGenSchema } from '../schema/shared-schema';

/**
 * Set workspace default project if not specified default project
 * default project will be used for executing `nx` command without target project specified
 * @param host
 * @param schema
 */
export function setDefaultProject<
  NormalizedAppSchema extends BasicNormalizedAppGenSchema
>(host: Tree, schema: NormalizedAppSchema): void {
  const workspace = readWorkspaceConfiguration(host);

  if (!workspace.defaultProject) {
    workspace.defaultProject = schema.projectRoot;
    updateWorkspaceConfiguration(host, workspace);
  }
}
