import { joinPathFragments } from '@nrwl/devkit';
import path from 'path';

import type {
  ESBuildExecutorSchema,
  NormalizedESBuildExecutorSchema,
} from '../schema';

import { normalizeESBuildExtendConfig } from './extend-config-file';
import { normalizeAssets } from 'nx-plugin-devkit';
import {
  normalizeInject,
  normalizeInserts,
  normalizeFileReplacements,
} from './normaliz-helper';

export function normalizeBuildExecutorOptions(
  options: ESBuildExecutorSchema,
  workspaceRoot: string,
  projectName: string,
  projectSourceRoot: string,
  projectRoot: string,
  appsLayout: string
): NormalizedESBuildExecutorSchema {
  const { main, tsconfigPath } = options;

  const outputPath = options.outputPath ?? `dist/${appsLayout}/${projectName}`;

  const formattedInserts = normalizeInserts(options.inserts ?? []);

  // TODO: config file generator
  // TODO: if .ts is not found, use .js file
  const pluginConfigPath = path.resolve(
    workspaceRoot,
    options.pluginConfigPath ?? 'nx-esbuild.ts'
  );

  const userConfigBuildOptions = options.allowExtend
    ? normalizeESBuildExtendConfig(
        path.resolve(workspaceRoot, projectRoot),

        pluginConfigPath
      )
    : {};

  if (!Array.isArray(options.inject)) {
    options.inject = [options.inject];
  }

  const normalizedInject = normalizeInject(options.inject, projectSourceRoot);

  const watchDir = options.watchDir
    ? path.isAbsolute(options.watchDir)
      ? options.watchDir
      : path.join(workspaceRoot, options.watchDir)
    : path.join(workspaceRoot, projectSourceRoot);

  const fileReplacements = normalizeFileReplacements(
    workspaceRoot,
    options.fileReplacements
  );

  return {
    ...options,
    // PROJECT-NAME
    projectName,
    // D:/PROJECT
    workspaceRoot,
    // apps/app1/src
    projectSourceRoot,
    // apps/app1
    projectRoot,
    // D:/PROJECT/apps/app1/src/main.ts
    main: path.resolve(workspaceRoot, main),
    // D:/PROJECT/dist/app1
    outputPath: path.resolve(workspaceRoot, outputPath),
    // D:/PROJECT/apps/app1/tsconfigPath.app.json
    tsconfigPath: path.resolve(workspaceRoot, tsconfigPath),
    // [{replace:"", with: ""}]
    fileReplacements,
    assets: normalizeAssets(options.assets, workspaceRoot, options.outputPath),
    inserts: formattedInserts,
    inject: normalizedInject,
    extendBuildOptions: userConfigBuildOptions,
    watchDir,
  };
}
