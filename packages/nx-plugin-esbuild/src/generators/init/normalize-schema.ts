import { Tree, joinPathFragments, getWorkspaceLayout } from '@nrwl/devkit';
import { normalizeNodeAppSchema } from 'nx-plugin-devkit';

import {
  ESBuildInitGeneratorSchema,
  NormalizedESBuildInitGeneratorSchema,
  ESBuildInitGeneratorExtraSchema,
} from './schema';

export function normalizeSchema(
  host: Tree,
  schema: ESBuildInitGeneratorSchema
): NormalizedESBuildInitGeneratorSchema {
  const basicNormalizedAppGenSchema = normalizeNodeAppSchema(host, schema);

  const { projectName, projectRoot } = basicNormalizedAppGenSchema;

  const { appsDir } = getWorkspaceLayout(host);

  const entry = schema.entry
    ? // apps/app1/src/main.ts
      schema.entry.startsWith(projectRoot)
      ? schema.entry
      : // app1/src/main.ts
      schema.entry.startsWith(projectName)
      ? joinPathFragments(appsDir, schema.entry)
      : // src/main.ts
        joinPathFragments(projectRoot, schema.entry)
    : `${projectRoot}/src/main.ts`;

  const tsconfigPath = schema.tsconfigPath
    ? // apps/app1/src/tsconfig.app.json
      schema.tsconfigPath.startsWith(projectRoot)
      ? schema.entry
      : // app1/src/tsconfig.app.json
      schema.entry.startsWith(projectName)
      ? joinPathFragments(appsDir, schema.tsconfigPath)
      : // src/tsconfig.app.json
        joinPathFragments(projectRoot, schema.tsconfigPath)
    : `${projectRoot}/tsconfig.app.json`;

  const extraOptions: ESBuildInitGeneratorExtraSchema = {
    entry,
    outputPath: schema.outputPath ?? `dist/apps/${projectName}`,
    tsconfigPath,
    assets: schema.assets ?? [`${projectRoot}/src/assets`],
    watch: schema.watch,
    bundle: schema.bundle,
    platform: schema.platform,
    decoratorHandler: schema.decoratorHandler,
    latestPackage: schema.latestPackage,
  };

  return {
    ...extraOptions,
    ...basicNormalizedAppGenSchema,
  };
}
