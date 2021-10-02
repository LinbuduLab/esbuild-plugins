import {
  formatFiles,
  Tree,
  installPackagesTask,
  GeneratorCallback,
  addDependenciesToPackageJson,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import path from 'path';
import { normalizeSchema } from './normalize-schema';
import { ESBuildInitGeneratorSchema } from './schema';
import {
  createNodeInitTask,
  createNodeJestTask,
  createNodeLintTask,
  createNodeAppProject,
  createNodeAppFiles,
  setDefaultProject,
  setupProxy,
} from 'nx-plugin-devkit';
import pacote from 'pacote';

import { createProductionConfiguration } from '../../utils/preset-configuration';
import {
  ESBUILD_DEP_VERSION,
  DEFAULT_EXTEND_CONFIG_FILE,
  BUILD_TARGET_NAME,
  SERVE_TARGET_NAME,
} from '../../utils/constants';

export default async function (host: Tree, schema: ESBuildInitGeneratorSchema) {
  const normalizedSchema = normalizeSchema(host, schema);

  const {
    projectName,
    watch,
    projectSourceRoot,
    entry,
    outputPath,
    tsconfigPath,
    assets,
    bundle,
    platform,
    decoratorHandler,
  } = normalizedSchema;

  const tasks: GeneratorCallback[] = [];

  const initTask = await createNodeInitTask(host);
  tasks.push(initTask);

  createNodeAppProject(
    host,
    normalizedSchema,
    {
      executor: 'nx-plugin-esbuild:build',
      options: {
        main: entry,
        tsconfigPath,
        outputPath,
        watch,
        assets,
        bundle,
        platform,
        extendConfig: DEFAULT_EXTEND_CONFIG_FILE,
      },
      configurations: {
        production: createProductionConfiguration(projectSourceRoot),
      },
    },
    {
      executor: 'nx-plugin-workspace:node-serve',
      options: {
        buildTarget: `${projectName}:${BUILD_TARGET_NAME}`,
      },
      configurations: {
        production: {
          buildTarget: `${projectName}:${BUILD_TARGET_NAME}:production`,
        },
      },
    },
    BUILD_TARGET_NAME,
    SERVE_TARGET_NAME
  );

  createNodeAppFiles(host, normalizedSchema, path.join(__dirname, './files'));

  const lintTask = await createNodeLintTask(host, normalizedSchema);
  tasks.push(lintTask);

  // FIXME: tsconfig.spec.json must has compilerOptions.composite defined
  // some configurarion should be overrided in tsconfig.spec.json
  // const jestTask = await createNodeJestTask(host, normalizedSchema);
  // tasks.push(jestTask);

  setupProxy(host, normalizedSchema);
  setDefaultProject(host, normalizedSchema);

  await formatFiles(host);

  let esbuildPackageVersion = ESBUILD_DEP_VERSION;

  if (schema.latestPackage) {
    const { version } = await pacote.manifest('esbuild');
    esbuildPackageVersion = version;
  }

  const installDepsTask = addDependenciesToPackageJson(
    host,
    {},
    {
      esbuild: esbuildPackageVersion,
      'esbuild-plugin-alias-path': 'latest',
    }
  );

  tasks.push(installDepsTask);

  return () => {
    runTasksInSerial(...tasks);
    installPackagesTask(host);
  };
}
