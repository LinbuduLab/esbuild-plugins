import type {
  ESBuildExecutorSchema,
  NormalizedESBuildExecutorSchema,
} from '../schema';

import path from 'path';
import fs from 'fs-extra';

import { normalizeESBuildExtendConfig } from './extend-config-file';
import { normalizeAssets } from 'nx-plugin-devkit';
import {
  normalizeInject,
  normalizeInserts,
  normalizeFileReplacements,
} from './normaliz-helper';
import consola from 'consola';
import chalk from 'chalk';
import { DEFAULT_EXTEND_CONFIG_FILE } from './constants';
import { NXESBuildConfigExport } from 'src';
import { ensureArray } from './utils';

export interface ExtraNormalizeOptions {
  absoluteWorkspaceRoot: string;
  projectName: string;
  projectRoot: string;
  projectSourceRoot: string;
  projectLayout: string;
}

export function normalizeBuildExecutorOptions(
  options: ESBuildExecutorSchema,
  extraOptions: ExtraNormalizeOptions
): NormalizedESBuildExecutorSchema {
  const { main, tsconfigPath, verbose } = options;
  const {
    absoluteWorkspaceRoot,
    projectName,
    projectRoot,
    projectSourceRoot,
    projectLayout,
  } = extraOptions;

  const outputPath =
    options.outputPath ?? `${projectLayout}/${projectName}/dist`;

  // TODO:
  const normalizedInserts = normalizeInserts(options.inserts ?? []);

  // If extend config exist, we extend it to ESBuild config resolve
  const pluginExtendConfigPath = path.resolve(
    absoluteWorkspaceRoot,
    projectRoot,
    options.pluginConfigPath ?? DEFAULT_EXTEND_CONFIG_FILE
  );

  const extendConfigFileExist = fs.existsSync(pluginExtendConfigPath);

  verbose
    ? extendConfigFileExist
      ? consola.info(
          `Extending nx-esbuild config file from ${chalk.cyan(
            pluginExtendConfigPath
          )} \n`
        )
      : consola.info(
          `No nx-esbuild config file found in ${chalk.cyan(
            pluginExtendConfigPath
          )}`
        )
    : void 0;

  const userConfigBuildOptions = extendConfigFileExist
    ? normalizeESBuildExtendConfig(
        path.resolve(absoluteWorkspaceRoot, projectRoot),
        pluginExtendConfigPath,
        verbose
      )
    : {};

  if (!Array.isArray(options.inject)) {
    options.inject = [options.inject];
  }

  const normalizedInject = normalizeInject(options.inject, projectSourceRoot);

  const nomalizedWatchDir: string[] = options.watchDir
    ? ensureArray(options.watchDir)
        .map((dir) =>
          path.isAbsolute(dir) ? dir : path.join(absoluteWorkspaceRoot, dir)
        )
        .concat(path.join(absoluteWorkspaceRoot, projectSourceRoot))
    : // watch only source directory by default
      [path.join(absoluteWorkspaceRoot, projectSourceRoot)];

  const normalizedFileReplacements = normalizeFileReplacements(
    absoluteWorkspaceRoot,
    options.fileReplacements
  );

  const normalizedAssets = normalizeAssets(
    options.assets,
    absoluteWorkspaceRoot,
    options.outputPath
  );

  return {
    ...options,
    // PROJECT-NAME
    projectName,
    absoluteWorkspaceRoot,
    projectSourceRoot,
    projectRoot,
    // ABSOLUTE_WORKSPACE_ROOT/PROJECT_LAYOUT/PROJECT/src/main.ts
    main: path.resolve(absoluteWorkspaceRoot, main),
    // WORKSPACE/PROJECT/app1
    outputPath: path.resolve(absoluteWorkspaceRoot, outputPath),
    // ABSOLUTE_WORKSPACE_ROOT/PROJECT_LAYOUT/PROJECT/tsconfigPath.app.json
    tsconfigPath: path.resolve(absoluteWorkspaceRoot, tsconfigPath),
    // [{replace:"", with: ""}]
    fileReplacements: normalizedFileReplacements,
    assets: normalizedAssets,
    // banner & footer
    inserts: normalizedInserts,
    inject: normalizedInject,
    watchDir: nomalizedWatchDir,
    extendBuildOptions: userConfigBuildOptions.esbuildOptions ?? {},
    extendWatchOptions: userConfigBuildOptions.watchOptions ?? {},
  };
}
