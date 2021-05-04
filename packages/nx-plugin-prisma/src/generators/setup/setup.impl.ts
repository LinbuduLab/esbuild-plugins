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
import { updateGitIgnore } from 'nx-plugin-devkit';

export default async function (host: Tree, schema: PrismaSetupGeneratorSchema) {
  // updateGitIgnore(host, ['prisma/client/']);
  const normalizedSchema = normalizeSchema(host, schema);

  const tasks: GeneratorCallback[] = [];

  createPrismaSchemaFiles(host, normalizedSchema);

  const projectConfig = createPrismaProjectConfiguration(normalizedSchema);
  updateProjectConfiguration(host, normalizedSchema.projectName, projectConfig);

  await formatFiles(host);

  return () => {
    installPackagesTask(host);
    runTasksInSerial(...tasks);
  };
}
