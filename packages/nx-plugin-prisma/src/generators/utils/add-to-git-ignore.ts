import {
  addProjectConfiguration,
  formatFiles,
  installPackagesTask,
  GeneratorCallback,
  Tree,
  joinPathFragments,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import {
  createNodeInitTask,
  createNodeJestTask,
  createNodeLintTask,
  setDefaultProject,
  updateGitIgnore,
} from 'nx-plugin-devkit';

import { NormalizedPrismaGeneratorSchema } from './schema-types';

export function addPrismaClientToGitIgnore<
  T extends NormalizedPrismaGeneratorSchema
>(host: Tree, schema: T): void {
  const prismaClientPath = joinPathFragments(
    schema.prismaSchemaDir,
    schema.clientOutput
  );
  updateGitIgnore(host, [prismaClientPath]);
}
