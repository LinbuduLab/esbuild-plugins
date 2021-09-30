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
import { ESBUILD_DEP_VERSION } from '../utils/constants';
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
    override,
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

  if (override || (!buildTargetConfig && !serveTargetConfig)) {
    projectConfig.targets['build'] = setupBuildTargetConfig;
    projectConfig.targets['serve'] = setupServeTargetConfig;
  } else {
    projectConfig.targets['esbuild-build'] = setupBuildTargetConfig;
    projectConfig.targets['esbuild-serve'] = setupServeTargetConfig;
  }

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
      'esbuild-plugin-decorator': 'latest',
      'esbuild-plugin-alias-path': 'latest',
      'esbuild-plugin-node-externals': 'latest',
    },
    {
      esbuild: esbuildPackageVersion,
    }
  );

  const tasks: GeneratorCallback[] = [];

  tasks.push(installDepsTask);

  addDependenciesToPackageJson(
    host,
    {
      'esbuild-plugin-decorator': 'latest',
      'esbuild-plugin-alias-path': 'latest',
      'esbuild-plugin-node-externals': 'latest',
    },
    {
      esbuild: esbuildPackageVersion,
    }
  );

  return () => {
    runTasksInSerial(...tasks);
    installPackagesTask(host);
  };
}
