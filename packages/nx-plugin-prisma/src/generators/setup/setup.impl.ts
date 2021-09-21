import {
  updateProjectConfiguration,
  formatFiles,
  installPackagesTask,
  GeneratorCallback,
  Tree,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { setupProxy, addProjectDepsToPackageJSON } from 'nx-plugin-devkit';
import { PrismaSetupGeneratorSchema } from './schema';
import { normalizeSchema } from '../utils/normalize-schema';
import { createPrismaSchemaFiles } from '../utils/create-files';
import { setupPrismaProjectConfiguration } from '../utils/setup-config';
import { shouldOverrideExistPrismaTargets } from './lib/should-override';
import { addPrismaClientToIgnore } from '../utils/update-ignore';

export default async function (host: Tree, schema: PrismaSetupGeneratorSchema) {
  const normalizedSchema = normalizeSchema(host, schema);

  shouldOverrideExistPrismaTargets(host, {
    ...normalizedSchema,
    override: schema.override,
  });

  const tasks: GeneratorCallback[] = [];

  createPrismaSchemaFiles(host, normalizedSchema);

  const projectConfig = setupPrismaProjectConfiguration(host, normalizedSchema);
  updateProjectConfiguration(host, normalizedSchema.projectName, projectConfig);

  addPrismaClientToIgnore(host, normalizedSchema);

  setupProxy(host, normalizedSchema);

  await formatFiles(host);

  return () => {
    installPackagesTask(host);
    runTasksInSerial(...tasks);
  };
}
