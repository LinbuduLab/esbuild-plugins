import {
  addProjectConfiguration,
  formatFiles,
  installPackagesTask,
  GeneratorCallback,
  Tree,
  addDependenciesToPackageJson,
  updateJson,
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
import path from 'path';
import consola from 'consola';

import { PrismaInitGeneratorSchema } from './schema';

import { normalizeSchema } from '../utils/normalize-schema';
import {
  createPrismaSchemaFiles,
  addPrismaClientToIgnore,
} from '../utils/file-utils';
import { initPrismaProjectConfiguration } from '../utils/prisma-workspace-config';
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

  let packageVersion = INTEGRATED_VERSION;

  if (schema.latestPackage) {
    consola.info('Fetching latest version of `prisma`, `@prisma/client`');
    // use one of it
    const { version } = await pacote.manifest('prisma');
    // const { version: clientVersion } = await pacote.manifest('@prisma/client');
    packageVersion = version;
  }

  const initialPackageDeps = {
    '@prisma/client': packageVersion,
  };

  const initialPackageDevDeps = {
    prisma: packageVersion,
    '@types/ncp': '^2.0.5',
    execa: '^5.1.1',
    ncp: '^2.0.0',
    'ts-node': '^10.2.1',
    'ts-node-dev': '^1.1.8',
    typescript: '^4.4.3',
  };

  // create package.json
  createPackageJSON(
    {
      name: normalizedSchema.projectName,
      version: '1.0.0',
      scripts: {
        dev: 'ts-node-dev --respawn scripts/dev.ts',
        build: 'ts-node-dev --respawn scripts/build.ts',
        start: 'npm run build && node dist/main.js',
      },
      dependencies: initialPackageDeps,
      devDependencies: initialPackageDevDeps,
    },
    normalizedSchema.projectRoot
  );

  addPrismaClientToIgnore(host, normalizedSchema);
  setDefaultProject(host, normalizedSchema);
  setupProxy(host, normalizedSchema);

  const addDepsTask = addDependenciesToPackageJson(
    host,
    initialPackageDeps,
    initialPackageDevDeps
  );

  tasks.push(addDepsTask);

  await formatFiles(host);

  return () => {
    runTasksInSerial(...tasks);
    installPackagesTask(host);

  };
}
