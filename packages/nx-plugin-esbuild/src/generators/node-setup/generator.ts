import {
  formatFiles,
  Tree,
  installPackagesTask,
  addDependenciesToPackageJson,
  updateProjectConfiguration,
  readProjectConfiguration,
  GeneratorCallback,
} from '@nrwl/devkit';
import pacote from 'pacote';

import { NormalizedESBuildSetupGeneratorSchema } from './schema';
import { normalizeSchema } from './normalize-schema';
import {
  BUILD_TARGET_NAME,
  ESBUILD_DEP_VERSION,
  SERVE_TARGET_NAME,
} from '../../utils/constants';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

export default async function (
  host: Tree,
  schema: NormalizedESBuildSetupGeneratorSchema
) {
  const normalizedSchema = normalizeSchema(host, schema);

  const {
    projectName,
    projectRoot,
    projectSourceRoot,
    buildTargetConfig,
    serveTargetConfig,
    entry,
    tsconfigPath,
    outputPath,
    watch,
    assets,
  } = normalizedSchema;

  const projectConfig = readProjectConfiguration(host, projectName);

  const setupBuildTargetConfig = {
    ...buildTargetConfig,
    executor: 'nx-plugin-esbuild:build',
    options: {
      ...(buildTargetConfig.options ?? {}),
      outputPath,
      main: entry,
      tsconfigPath,
      assets,
      watch,
    },
    configurations: {
      ...(buildTargetConfig?.configurations ?? {}),
    },
  };

  const setupServeTargetConfig = {
    ...serveTargetConfig,
    executor: 'nx-plugin-workspace:node-serve',
    options: {
      ...(serveTargetConfig.options ?? {}),
      buildTarget: `${projectName}:build`,
    },
    configurations: {
      ...(serveTargetConfig?.configurations ?? {}),
    },
  };

  projectConfig.targets[BUILD_TARGET_NAME] = setupBuildTargetConfig;
  projectConfig.targets[SERVE_TARGET_NAME] = setupServeTargetConfig;

  updateProjectConfiguration(host, projectName, projectConfig);

  await formatFiles(host);

  let esbuildPackageVersion = ESBUILD_DEP_VERSION;

  if (schema.latestPackage) {
    const { version } = await pacote.manifest('esbuild');
    esbuildPackageVersion = version;
  }

  const installDepsTask = addDependenciesToPackageJson(
    host,
    {
      'esbuild-plugin-alias-path': 'latest',
    },
    {
      esbuild: esbuildPackageVersion,
    }
  );

  const tasks: GeneratorCallback[] = [];

  tasks.push(installDepsTask);

  addDependenciesToPackageJson(
    host,
    {},
    {
      esbuild: esbuildPackageVersion,
      'esbuild-plugin-alias-path': 'latest',
    }
  );

  return () => {
    runTasksInSerial(...tasks);
    installPackagesTask(host);
  };
}
