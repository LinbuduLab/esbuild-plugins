import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
  updateJson,
  addDependenciesToPackageJson,
  joinPathFragments,
  updateProjectConfiguration,
  readProjectConfiguration,
} from '@nrwl/devkit';
import path from 'path';

import {
  ESBuildSetupGeneratorSchema,
  NormalizedESBuildSetupGeneratorSchema,
} from './schema';
import { getAvailableAppsOrLibs } from '../../utils';

export default async function (
  host: Tree,
  schema: NormalizedESBuildSetupGeneratorSchema
) {
  const normalizedSchema = normalizeSchema(host, schema);
  console.log('schema: ', normalizedSchema);

  const projectConfig = readProjectConfiguration(
    host,
    normalizedSchema.appOrLib
  );

  if (normalizedSchema.override) {
    projectConfig.targets['build'] = {
      ...normalizedSchema.buildTargetConfig,
      executor: 'nx-plugin-esbuild:build',
    };
  } else {
    projectConfig.targets['esbuild-build'] = {
      executor: 'nx-plugin-esbuild:build',
      options: {
        ...normalizedSchema.buildTargetConfig.options,
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

  updateProjectConfiguration(host, normalizedSchema.appOrLib, projectConfig);

  await formatFiles(host);

  // console.log(projectConfig.targets['esbuild-build']);
  // console.log(projectConfig.targets['build']);
}

export function normalizeSchema(
  host: Tree,
  schema: ESBuildSetupGeneratorSchema
): NormalizedESBuildSetupGeneratorSchema {
  const { apps, libs } = getAvailableAppsOrLibs(host);

  const appNames = apps.map((app) => app.appName);
  const libNames = libs.map((lib) => lib.libName);

  if (
    !appNames.includes(schema.appOrLib) &&
    !libNames.includes(schema.appOrLib)
  ) {
    throw new Error(`App or Lib ${schema.appOrLib} dose not exist`);
  }

  const { projectType, root, sourceRoot, targets } = readProjectConfiguration(
    host,
    schema.appOrLib
  );

  // console.log(
  //   'projectType, root, sourceRoot, targets: ',
  //   projectType,
  //   root,
  //   sourceRoot,
  //   targets
  // );

  // FIXME: use outputPath / main / tsConfig / assets in existing build target option first
  // if there is no build target, then compose the path like below

  const isApp = projectType === 'application';

  // src/xxx.ts
  schema.entry = schema.entry
    ? joinPathFragments(root, schema.entry)
    : joinPathFragments(sourceRoot, isApp ? 'main.ts' : 'index.ts');

  schema.tsconfigPath = schema.tsconfigPath
    ? joinPathFragments(root, schema.tsconfigPath)
    : joinPathFragments(root, `tsconfig.${isApp ? 'app' : 'lib'}.json`);

  schema.outputPath = schema.outputPath
    ? schema.outputPath
    : joinPathFragments('dist', root);

  return {
    ...schema,
    projectRoot: root,
    projectSourceRoot: sourceRoot,
    isApp,
    buildTargetConfig: targets['build'],
  };
}
