import {
  addProjectConfiguration,
  formatFiles,
  installPackagesTask,
  GeneratorCallback,
  Tree,
  addDependenciesToPackageJson,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import {
  createNodeInitTask,
  createNodeJestTask,
  createNodeLintTask,
  setDefaultProject,
  setupProxy,
  createPackageJSON,
} from 'nx-plugin-devkit';
import pacote from 'pacote';
import consola from 'consola';

import { PrismaInitGeneratorSchema } from './schema';
import { normalizeSchema } from '../utils/normalize-schema';
import { createPrismaSchemaFiles } from '../utils/create-files';
import { initPrismaProjectConfiguration } from '../utils/setup-config';
import { addPrismaClientToIgnore } from '../utils/update-ignore';
import { INTEGRATED_VERSION } from '../utils/constants';

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

  // TODO: USE --latest to enable fetching latest version
  // consola.info('Fetching latest version of `prisma`, `@prisma/client`');
  // const { version: cliVersion } = await pacote.manifest('prisma');
  // const { version: clientVersion } = await pacote.manifest('@prisma/client');

  // create package.json
  createPackageJSON(
    {
      name: normalizedSchema.projectName,
      version: '1.0.0',
      scripts: {},
      dependencies: {
        '@prisma/client': INTEGRATED_VERSION,
      },
      devDependencies: {
        prisma: INTEGRATED_VERSION,
      },
    },
    normalizedSchema.projectRoot
  );

  addPrismaClientToIgnore(host, normalizedSchema);

  setDefaultProject(host, normalizedSchema);

  setupProxy(host, normalizedSchema);

  const addDepsTask = addDependenciesToPackageJson(
    host,
    {
      '@prisma/client': INTEGRATED_VERSION,
    },
    {
      prisma: INTEGRATED_VERSION,
    }
  );

  tasks.push(addDepsTask);

  await formatFiles(host);

  return () => {
    installPackagesTask(host);
    runTasksInSerial(...tasks);
  };
}
