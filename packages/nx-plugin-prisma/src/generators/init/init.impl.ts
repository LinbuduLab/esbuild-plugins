import {
  addProjectConfiguration,
  formatFiles,
  installPackagesTask,
  GeneratorCallback,
  Tree,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import {
  createNodeInitTask,
  createNodeJestTask,
  createNodeLintTask,
  setDefaultProject,
  setupProxy,
} from 'nx-plugin-devkit';

import { PrismaInitGeneratorSchema } from './schema';
import { normalizeSchema } from '../utils/normalize-schema';
import { createPrismaSchemaFiles } from '../utils/create-files';
import { initPrismaProjectConfiguration } from '../utils/setup-config';
import { addPrismaClientToGitIgnore } from '../utils/add-to-git-ignore';

export default async function (host: Tree, schema: PrismaInitGeneratorSchema) {
  const normalizedSchema = normalizeSchema(host, schema);

  const tasks: GeneratorCallback[] = [];

  const initTask = await createNodeInitTask(host);
  tasks.push(initTask);

  createPrismaSchemaFiles(host, normalizedSchema);

  const projectConfig = initPrismaProjectConfiguration(normalizedSchema);
  addProjectConfiguration(host, normalizedSchema.projectName, projectConfig);

  const lintTask = await createNodeLintTask(host, normalizedSchema);
  tasks.push(lintTask);

  const jestTask = await createNodeJestTask(host, normalizedSchema);
  tasks.push(jestTask);

  addPrismaClientToGitIgnore(host, normalizedSchema);

  setDefaultProject(host, normalizedSchema);

  setupProxy(host, normalizedSchema);

  await formatFiles(host);

  return () => {
    installPackagesTask(host);
    runTasksInSerial(...tasks);
  };
}
