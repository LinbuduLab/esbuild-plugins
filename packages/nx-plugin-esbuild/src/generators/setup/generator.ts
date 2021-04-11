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
  console.log('schema: ', normalizedSchema);

  const projectConfig = readProjectConfiguration(host, normalizedSchema.app);

  if (normalizedSchema.override) {
    projectConfig.targets['build'] = {
      ...normalizedSchema.buildTargetConfig,
      executor: 'nx-plugin-esbuild:build',
    };
  } else {
    projectConfig.targets['esbuild-build'] = {
      executor: 'nx-plugin-esbuild:build',
      options: {
        ...(normalizedSchema.buildTargetConfig?.options ?? {}),
        main: normalizedSchema.entry,
        tsConfig: normalizedSchema.tsconfigPath,
        outputPath: normalizedSchema.outputPath,
        watch: normalizedSchema.watch,
      },
      configurations: {
        ...(normalizedSchema.buildTargetConfig?.configurations ?? {}),
      },
    };
  }

  updateProjectConfiguration(host, normalizedSchema.app, projectConfig);

  await formatFiles(host);

  const deps = composeDepsList(normalizedSchema);
  const devDeps = composeDevDepsList(normalizedSchema);

  addDependenciesToPackageJson(host, deps, devDeps);

  return () => {
    installPackagesTask(host);
  };
}
