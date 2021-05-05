import {
  formatFiles,
  Tree,
  installPackagesTask,
  addDependenciesToPackageJson,
  updateProjectConfiguration,
  readProjectConfiguration,
} from '@nrwl/devkit';

import { NormalizedESBuildSetupGeneratorSchema } from './schema';
import { normalizeSchema } from './lib/normalize-schema';
import { composeDepsList, composeDevDepsList } from './lib/compose-deps';

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
    // TODO: expose plugin option in executor schema
    useTSCPluginForDecorator,
  } = normalizedSchema;

  const projectConfig = readProjectConfiguration(host, projectName);

  const setupBuildTargetConfig = {
    ...buildTargetConfig,
    executor: 'nx-plugin-esbuild:build',
    options: {
      ...(buildTargetConfig.options ?? {}),
      outputPath,
      main: entry,
      tsConfig: tsconfigPath,
      assets,
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

  if (override) {
    projectConfig.targets['build'] = setupBuildTargetConfig;
    projectConfig.targets['serve'] = setupServeTargetConfig;
  } else {
    projectConfig.targets['esbuild'] = setupBuildTargetConfig;
    projectConfig.targets['esserve'] = setupServeTargetConfig;
  }

  updateProjectConfiguration(host, projectName, projectConfig);

  await formatFiles(host);

  const deps = composeDepsList(normalizedSchema);
  const devDeps = composeDevDepsList(normalizedSchema);

  addDependenciesToPackageJson(host, deps, devDeps);

  return () => {
    installPackagesTask(host);
  };
}
