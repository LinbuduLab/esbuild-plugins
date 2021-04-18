import {
  Tree,
  joinPathFragments,
  readProjectConfiguration,
  names,
} from '@nrwl/devkit';
import { getAvailableAppsOrLibs } from 'nx-plugin-devkit';
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
    throw new Error(`App  ${schema.app} dose not exist!`);
  }

  const projectName = names(schema.app).fileName;

  const { root, sourceRoot, targets } = readProjectConfiguration(
    host,
    projectName
  );

  const existBuildTargetOptions = targets['build'].options;

  const existServeTargetOptions = targets['serve'].options;

  // if specified when calling setup generator, then use the specified path;
  // if not specified, and build target options contain this config, use this path;
  // if both not, use PROJECT_SOURCE_ROOT/main.ts, e.g apps/app1/src/main.ts

  const entry = schema.entry
    ? joinPathFragments(root, schema.entry)
    : existBuildTargetOptions?.main ?? joinPathFragments(sourceRoot, 'main.ts');

  const tsconfigPath = schema.tsconfigPath
    ? joinPathFragments(root, schema.tsconfigPath)
    : existBuildTargetOptions?.tsConfig ??
      joinPathFragments(root, 'tsconfig.app.json');

  const outputPath = schema.outputPath
    ? schema.outputPath
    : existBuildTargetOptions?.outputPath ?? joinPathFragments('dist', root);

  const assets = existBuildTargetOptions?.assets ?? [];

  return {
    ...schema,
    entry,
    tsconfigPath,
    outputPath,
    projectRoot: root,
    projectName,
    projectSourceRoot: sourceRoot,
    buildTargetConfig: targets['build'],
    serveTargetConfig: targets['serve'],
    assets,
  };
}
