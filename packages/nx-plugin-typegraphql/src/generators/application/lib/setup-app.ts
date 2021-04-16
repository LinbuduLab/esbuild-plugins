import {
  addProjectConfiguration,
  generateFiles,
  offsetFromRoot,
  Tree,
  ProjectConfiguration,
  NxJsonProjectConfiguration,
  joinPathFragments,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';

import { Linter, lintProjectGenerator } from '@nrwl/linter';
import path from 'path';
import { NormalizedTypeGraphQLResolverSchema } from '../schema';
import { createAppBuildConfig, createAppServeConfig } from './create-config';

export function createAppAsProject(
  host: Tree,
  schema: NormalizedTypeGraphQLResolverSchema
) {
  const project: ProjectConfiguration & NxJsonProjectConfiguration = {
    root: schema.appProjectRoot,
    sourceRoot: path.join(schema.appProjectRoot, 'src'),
    projectType: 'application',
    targets: {},
    tags: [],
  };

  project.targets.build = createAppBuildConfig(project, schema);
  project.targets.serve = createAppServeConfig(schema);

  addProjectConfiguration(host, schema.app, project);

  const workspace = readWorkspaceConfiguration(host);

  if (!workspace.defaultProject) {
    workspace.defaultProject = schema.app;
    updateWorkspaceConfiguration(host, workspace);
  }
}

export function createAppFiles(
  host: Tree,
  schema: NormalizedTypeGraphQLResolverSchema
) {
  generateFiles(
    host,
    path.join(__dirname, './files/apollo'),
    schema.appProjectRoot,
    {
      tmpl: '',
      name: schema.app,
      root: schema.appProjectRoot,
      offset: offsetFromRoot(schema.appProjectRoot),
    }
  );
}

export async function createAppLinter(
  host: Tree,
  schema: NormalizedTypeGraphQLResolverSchema
) {
  const lintTask = await lintProjectGenerator(host, {
    linter: Linter.EsLint,
    project: schema.app,
    tsConfigPaths: [
      joinPathFragments(schema.appProjectRoot, 'tsconfig.app.json'),
    ],
    eslintFilePatterns: [`${schema.appProjectRoot}/**/*.ts`],
    skipFormat: true,
  });

  return lintTask;
}
