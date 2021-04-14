import {
  Tree,
  joinPathFragments,
  readProjectConfiguration,
} from '@nrwl/devkit';
import { getAvailableAppsOrLibs } from '../../../utils';
import {
  ESBuildSetupGeneratorSchema,
  NormalizedESBuildSetupGeneratorSchema,
} from '../schema';

export function normalizeSchema(
  host: Tree,
  schema: ESBuildSetupGeneratorSchema
): NormalizedESBuildSetupGeneratorSchema {
  const { apps } = getAvailableAppsOrLibs(host);

  const appNames = apps.map((app) => app.appName);

  if (!appNames.includes(schema.app)) {
    throw new Error(`App  ${schema.app} dose not exist`);
  }

  const { root, sourceRoot, targets } = readProjectConfiguration(
    host,
    schema.app
  );

  // FIXME: use outputPath / main / tsConfig / assets in existing build target option first
  // if there is no build target, then compose the path like below

  const existBuildTargetOptions = targets['build'].options;

  // src/xxx.ts
  schema.entry = schema.entry
    ? joinPathFragments(root, schema.entry)
    : existBuildTargetOptions?.main ?? joinPathFragments(sourceRoot, 'main.ts');

  schema.tsconfigPath = schema.tsconfigPath
    ? joinPathFragments(root, schema.tsconfigPath)
    : existBuildTargetOptions?.tsConfig ??
      joinPathFragments(root, 'tsconfig.app.json');

  schema.outputPath = schema.outputPath
    ? schema.outputPath
    : existBuildTargetOptions?.outputPath ?? joinPathFragments('dist', root);

  const assets = existBuildTargetOptions?.assets ?? [];

  return {
    ...schema,
    projectRoot: root,
    projectSourceRoot: sourceRoot,
    buildTargetConfig: targets['build'],
    assets,
  };
}
