import path from 'path';

import type {
  ESBuildExecutorSchema,
  NormalizedESBuildExecutorSchema,
  MetaConfig,
} from '../schema';

import { normalizeAssets, normalizeFileReplacements } from 'nx-plugin-devkit';
import { normalizeESBuildExtendConfig } from './extend-config-file';

import { normalizeInserts } from './insert';

export function normalizeBuildExecutorOptions(
  options: ESBuildExecutorSchema,
  workspaceRoot: string,
  projectName: string,
  sourceRoot: string,
  projectRoot: string
): NormalizedESBuildExecutorSchema {
  const { banner, footer } = normalizeInserts(options.insert ?? []);
  const { main, outputPath, tsConfig } = normalizeMetaConfig(
    options.main,
    options.outputPath,
    options.tsConfig,
    projectName
  );

  // TODO: extend config
  // TODO: support js/ts file
  const esbuildExtendConfig = normalizeESBuildExtendConfig(
    `${workspaceRoot}/nx-esbuild.json`,
    workspaceRoot
  );

  return {
    ...options,
    // D:/PROJECT
    workspaceRoot,
    // apps/app1/src
    sourceRoot,
    // apps/app1
    projectRoot,
    // D:/PROJECT/apps/app1/src/main.ts
    main: path.resolve(workspaceRoot, main),
    // D:/PROJECT/dist/app1
    outputPath: path.resolve(workspaceRoot, outputPath),
    // D:/PROJECT/apps/app1/tsconfig.app.json
    tsConfig: path.resolve(workspaceRoot, tsConfig),
    fileReplacements: normalizeFileReplacements(
      workspaceRoot,
      options.fileReplacements
    ),
    skipTypeCheck: options.skipTypeCheck ?? false,
    assets: normalizeAssets(options.assets, workspaceRoot, options.outputPath),
    esbuild: {
      bundle: options.bundle ?? true,
      watch: options.watch ?? false,
      ...options.esbuild,
      ...esbuildExtendConfig,
      // TODO: should br merged
      banner,
      footer,
    },
  };
}

// FIXME: executor cannot get workspace layout, so 'apps' will be used.
export function normalizeMetaConfig(
  main: string,
  outputPath: string,
  tsConfig: string,
  projectName: string
): MetaConfig {
  // TODO: log param missing cases and tips
  return {
    main: main ?? `apps/${projectName}/src/main.ts`,
    outputPath: outputPath ?? `dist/apps/${projectName}`,
    tsConfig: tsConfig ?? `apps/${projectName}/tsconfig.app.json`,
  };
}
