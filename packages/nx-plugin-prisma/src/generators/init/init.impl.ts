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
} from 'nx-plugin-devkit';
import { PrismaInitGeneratorSchema } from './schema';
import { normalizeSchema } from './lib/normalize-schema';
import { initPrismaFiles } from './lib/create-files';
import { createInitPrismaProjectConfiguration } from './lib/setup-config';
import { updateGitIgnore } from 'nx-plugin-devkit';

export default async function (host: Tree, schema: PrismaInitGeneratorSchema) {
  updateGitIgnore(host, ['d/']);
  const normalizedSchema = normalizeSchema(host, schema);

  const tasks: GeneratorCallback[] = [];

  const initTask = await createNodeInitTask(host);
  tasks.push(initTask);

  initPrismaFiles(host, normalizedSchema);

  // TODO: extract as createExecTargets
  const projectConfig = createInitPrismaProjectConfiguration(normalizedSchema);
  addProjectConfiguration(host, normalizedSchema.projectName, projectConfig);

  const lintTask = await createNodeLintTask(host, normalizedSchema);
  tasks.push(lintTask);

  const jestTask = await createNodeJestTask(host, normalizedSchema);
  tasks.push(jestTask);

  await formatFiles(host);

  setDefaultProject(host, normalizedSchema);

  return () => {
    installPackagesTask(host);
    runTasksInSerial(...tasks);
  };
}
