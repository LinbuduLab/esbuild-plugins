import path from 'path';
import fs from 'fs-extra';
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
import consola from 'consola';
import chalk from 'chalk';

export function normalizeBuildExecutorOptions(
  options: ESBuildExecutorSchema,
  workspaceRoot: string,
  projectName: string,
  projectSourceRoot: string,
  projectRoot: string,
  appsLayout: string
): NormalizedESBuildExecutorSchema {
  const { main, tsconfigPath, verbose } = options;

  const outputPath = options.outputPath ?? `dist/${appsLayout}/${projectName}`;

  const formattedInserts = normalizeInserts(options.inserts ?? []);

  const pluginConfigPath = path.resolve(
    workspaceRoot,
    projectRoot,
    options.pluginConfigPath ?? 'nx-esbuild.ts'
  );

  const shouldExtendConfig = fs.existsSync(pluginConfigPath);

  shouldExtendConfig &&
    verbose &&
    consola.info(
      `Extending config file from ${chalk.cyan(pluginConfigPath)}\n`
    );

  const userConfigBuildOptions = shouldExtendConfig
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
    extendBuildOptions: userConfigBuildOptions.esbuildOptions ?? {},
    extendWatchOptions: userConfigBuildOptions.watchOptions ?? {},
    // extendBuildOptions: {},
    // extendWatchOptions: {},
    watchDir,
  };
}
