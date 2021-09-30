import {
  Tree,
  joinPathFragments,
  readProjectConfiguration,
  names,
  getWorkspaceLayout,
} from '@nrwl/devkit';
import { getAvailableApps } from 'nx-plugin-devkit';
import {
  ESBuildSetupGeneratorSchema,
  NormalizedESBuildSetupGeneratorSchema,
} from './schema';

export function normalizeSchema(
  host: Tree,
  schema: ESBuildSetupGeneratorSchema
): NormalizedESBuildSetupGeneratorSchema {
  const apps = getAvailableApps(host);

  const appNames = apps.map((app) => app.appName);

  if (!appNames.includes(schema.app)) {
    throw new Error(`project  ${schema.app} dose not exist!`);
  }

  const projectName = names(schema.app).fileName;

  const {
    root: projectRoot,
    sourceRoot: projectSourceRoot,
    targets,
  } = readProjectConfiguration(host, projectName);
  const { appsDir } = getWorkspaceLayout(host);

  const existBuildTargetOptions = targets['build'].options;

  const existServeTargetOptions = targets['serve'].options;

  // if specified when calling setup generator, then use the specified path;
  // if not specified, and build target options contain this config, use this path;
  // if both not, use PROJECT_SOURCE_ROOT/main.ts, e.g. apps/app1/src/main.ts

  const entry = schema.entry
    ? // apps/app1/src/main.ts
      schema.entry.startsWith(projectRoot)
      ? // use it!
        schema.entry
      : // app1/src/main.ts
      schema.entry.startsWith(projectName)
      ? // join with nx.workspace.appDir
        joinPathFragments(appsDir, schema.entry)
      : // src/main.ts
        joinPathFragments(projectRoot, schema.entry)
    : existBuildTargetOptions?.main ??
      // final fallback: PROJECT_SRC_ROOT/main.ts
      joinPathFragments(projectSourceRoot, 'main.ts');

  const tsconfigPath = schema.tsconfigPath
    ? // apps/app1/src/tsconfig.app.json
      schema.tsconfigPath.startsWith(projectRoot)
      ? schema.entry
      : // app1/src/tsconfig.app.json
      schema.entry.startsWith(projectName)
      ? joinPathFragments(appsDir, schema.tsconfigPath)
      : // src/tsconfig.app.json
        joinPathFragments(projectRoot, schema.tsconfigPath)
    : joinPathFragments(projectRoot, 'tsconfig.app.json');

  const outputPath = schema.outputPath
    ? schema.outputPath
    : existBuildTargetOptions?.outputPath ??
      joinPathFragments('dist', projectRoot);

  const assets = existBuildTargetOptions?.assets ?? [];

  return {
    ...schema,
    entry,
    tsconfigPath,
    outputPath,
    projectRoot,
    projectName,
    projectSourceRoot,
    buildTargetConfig: targets['build'],
    serveTargetConfig: targets['serve'],
    assets,
  };
}
