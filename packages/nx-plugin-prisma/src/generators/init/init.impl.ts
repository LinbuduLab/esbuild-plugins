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

export default async function (host: Tree, schema: PrismaInitGeneratorSchema) {
  const normalizedSchema = normalizeSchema(host, schema);
  console.log('normalizedSchema: ', normalizedSchema);

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
