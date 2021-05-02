import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  installPackagesTask,
  GeneratorCallback,
  addDependenciesToPackageJson,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

import path from 'path';
import {
  createNodeInitTask,
  createNodeJestTask,
  createNodeLintTask,
  createNodeAppProject,
  createNodeAppFiles,
  setDefaultProject,
  setupProxy,
} from 'nx-plugin-devkit';
import { PrismaInitGeneratorSchema } from './schema';
import { normalizeSchema } from './lib/normalize-schema';

export default async function (host: Tree, schema: PrismaInitGeneratorSchema) {
  const normalizedSchema = normalizeSchema(host, schema);
  console.log('normalizedSchema: ', normalizedSchema);

  const tasks: GeneratorCallback[] = [];

  const initTask = await createNodeInitTask(host);
  tasks.push(initTask);

  // 抽离到nx-plugin-devkit
  // createExecTargets
  const project = readProjectConfiguration(host, normalizedSchema.projectName);

  // prisma generate
  project.targets['prisma-generate'] = {
    executor: 'nx-plugin-devkit:exec',
    options: {},
  };
}
