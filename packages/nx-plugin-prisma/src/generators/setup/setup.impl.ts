import {
  updateProjectConfiguration,
  formatFiles,
  installPackagesTask,
  GeneratorCallback,
  Tree,
  addDependenciesToPackageJson,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { setupProxy, updatePackageJson } from 'nx-plugin-devkit';
import pacote from 'pacote';
import consola from 'consola';

import { PrismaSetupGeneratorSchema } from './schema';

import { normalizeSchema } from '../utils/normalize-schema';
import {
  createPrismaSchemaFiles,
  addPrismaClientToIgnore,
} from '../utils/file-utils';
import { setupPrismaProjectConfiguration } from '../utils/prisma-workspace-config';
import { INTEGRATED_VERSION } from '../utils/constants';

export default async function (host: Tree, schema: PrismaSetupGeneratorSchema) {
  const normalizedSchema = normalizeSchema(host, schema, true);

  const tasks: GeneratorCallback[] = [];

  createPrismaSchemaFiles(host, normalizedSchema);

  const projectConfig = setupPrismaProjectConfiguration(host, normalizedSchema);
  updateProjectConfiguration(host, normalizedSchema.projectName, projectConfig);

  let packageVersion = INTEGRATED_VERSION;

  if (schema.latestPackage) {
    consola.info('Fetching latest version of `prisma`, `@prisma/client`');
    // use one of it
    const { version } = await pacote.manifest('prisma');
    // const { version: clientVersion } = await pacote.manifest('@prisma/client');
    packageVersion = version;
  }

  const appendPackageDeps = {
    '@prisma/client': packageVersion,
  };

  const appendPackageDevDeps = {
    prisma: packageVersion,
  };

  updatePackageJson(host, {
    scripts: {},
    dependencies: appendPackageDeps,
    devDependencies: appendPackageDevDeps,
  });

  addPrismaClientToIgnore(host, normalizedSchema);

  setupProxy(host, normalizedSchema);

  const addDepsTask = addDependenciesToPackageJson(
    host,
    appendPackageDeps,
    appendPackageDevDeps
  );

  tasks.push(addDepsTask);

  await formatFiles(host);

  return () => {
    installPackagesTask(host);
    runTasksInSerial(...tasks);
  };
}
