import {
  addProjectConfiguration,
  updateProjectConfiguration,
  formatFiles,
  installPackagesTask,
  GeneratorCallback,
  Tree,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

import { PrismaSetupGeneratorSchema } from './schema';
import { normalizeSchema } from '../utils/normalize-schema';
import { createPrismaSchemaFiles } from '../utils/create-files';
import { createPrismaProjectConfiguration } from '../utils/setup-config';
import { addPrismaClientToGitIgnore } from '../utils/add-to-git-ignore';

export default async function (host: Tree, schema: PrismaSetupGeneratorSchema) {
  const normalizedSchema = normalizeSchema(host, schema);

  const tasks: GeneratorCallback[] = [];

  createPrismaSchemaFiles(host, normalizedSchema);

  const projectConfig = createPrismaProjectConfiguration(normalizedSchema);
  updateProjectConfiguration(host, normalizedSchema.projectName, projectConfig);

  addPrismaClientToGitIgnore(host, normalizedSchema);

  await formatFiles(host);

  return () => {
    installPackagesTask(host);
    runTasksInSerial(...tasks);
  };
}
