import {
  formatFiles,
  Tree,
  installPackagesTask,
  GeneratorCallback,
  addDependenciesToPackageJson,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

import { NormalizedKoaAppGeneratorSchema } from './schema';

import { normalizeSchema } from './lib/normalize-schema';
import { composeDepsList, composeDevDepsList } from './lib/compose-deps';
import { createInitTask, createJestTask, createLintTask } from './lib/tasks';
import { createAppAsProject, createAppFiles } from './lib/setup-app';

export default async function (
  host: Tree,
  schema: NormalizedKoaAppGeneratorSchema
) {
  const normalizedSchema = normalizeSchema(host, schema);
  console.log('normalizedSchema: ', normalizedSchema);

  const {
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    offsetFromRoot,

    frontendProject,
    minimal,
    routingControllerBased,
    router,
  } = normalizedSchema;

  const tasks: GeneratorCallback[] = [];

  // push task by Promise.all ?
  const initTask = await createInitTask(host);
  tasks.push(initTask);

  // move to init task ?
  createAppAsProject(host, normalizedSchema);
  createAppFiles(host, normalizedSchema);

  const lintTask = await createLintTask(host, normalizedSchema);
  tasks.push(lintTask);

  const jestTask = await createJestTask(host, normalizedSchema);
  tasks.push(jestTask);

  const workspace = readWorkspaceConfiguration(host);

  if (!workspace.defaultProject) {
    workspace.defaultProject = schema.projectRoot;
    updateWorkspaceConfiguration(host, workspace);
  }

  await formatFiles(host);

  const deps = composeDepsList(normalizedSchema);
  const devDeps = composeDevDepsList(normalizedSchema);

  addDependenciesToPackageJson(host, deps, devDeps);

  return () => {
    installPackagesTask(host);
    runTasksInSerial(...tasks);
  };
}
