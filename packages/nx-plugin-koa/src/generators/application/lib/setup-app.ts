import {
  addProjectConfiguration,
  generateFiles,
  offsetFromRoot,
  Tree,
  joinPathFragments,
  ProjectConfiguration,
  NxJsonProjectConfiguration,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';

import path from 'path';
import { NormalizedKoaAppGeneratorSchema } from '../schema';
import { createAppBuildConfig, createAppServeConfig } from './create-config';

export function createAppAsProject(
  host: Tree,
  schema: NormalizedKoaAppGeneratorSchema
) {
  const project: ProjectConfiguration & NxJsonProjectConfiguration = {
    root: schema.projectRoot,
    sourceRoot: joinPathFragments(schema.projectRoot, 'src'),
    projectType: 'application',
    targets: {},
    tags: schema.parsedTags,
  };

  project.targets.build = createAppBuildConfig(project, schema);
  project.targets.serve = createAppServeConfig(schema);

  addProjectConfiguration(host, schema.projectName, project);

  const workspace = readWorkspaceConfiguration(host);

  if (!workspace.defaultProject) {
    workspace.defaultProject = schema.projectName;
    updateWorkspaceConfiguration(host, workspace);
  }
}

export function createAppFiles(
  host: Tree,
  schema: NormalizedKoaAppGeneratorSchema
) {
  generateFiles(host, path.join(__dirname, '../files'), schema.projectRoot, {
    tmpl: '',
    name: schema.app,
    root: schema.projectRoot,
    offset: offsetFromRoot(schema.projectRoot),
  });
}
