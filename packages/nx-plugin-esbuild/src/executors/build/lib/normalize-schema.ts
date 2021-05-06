import path from 'path';

import type {
  ESBuildExecutorSchema,
  NormalizedESBuildExecutorSchema,
} from '../schema';

import {
  normalizeAssets,
  normalizeFileReplacements,
  fileReplacements2Alias,
} from 'nx-plugin-devkit';
import { normalizeInserts } from './insert';

// FIXME: executor cannot get workspace layout, so 'apps' will be used.
// Choose a random project to get its starts?
export function normalizeMetaConfig(
  main: string,
  outputPath: string,
  tsConfig: string,
  projectName: string
) {
  return {
    main: main ?? `apps/${projectName}/src/main.ts`,
    outputPath: outputPath ?? `dist/apps/${projectName}`,
    tsConfig: tsConfig ?? `apps/${projectName}/tsconfig.app.json`,
  };
}

export function normalizeBuildExecutorOptions(
  options: ESBuildExecutorSchema,
  workspaceRoot: string,
  projectName: string,
  projectSourceRoot: string,
  projectRoot: string
): NormalizedESBuildExecutorSchema {
  const formattedInserts = normalizeInserts(options.inserts ?? []);
  const { main, outputPath, tsConfig } = normalizeMetaConfig(
    options.main,
    options.outputPath,
    options.tsConfig,
    projectName
  );

  if (options.platform === 'browser' && !options.format) {
    options.format = 'iife';
  }

  if (!Array.isArray(options.inject)) {
    options.inject = [options.inject];
  }

  const normalizedInject = options.inject.map((injectPath) => {
    if (!injectPath.endsWith('.js') && !injectPath.endsWith('.ts')) {
      throw new Error(
        `${injectPath} should be specified with suffix (.js/.ts)`
      );
    }
    const normalizedInjectPath = path.join(projectSourceRoot, injectPath);

    return normalizedInjectPath;
  });

  const fileReplacements = normalizeFileReplacements(
    workspaceRoot,
    options.fileReplacements
  );

  // const aliases = fileReplacements2Alias(
  //   options.fileReplacements,
  //   projectSourceRoot,
  //   workspaceRoot
  // );

  // TODO: support platform input like: node15.1.0
  // const platform = options.platform ?? process.version.slice(1);

  return {
    ...options,
    projectName,
    // platform,
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
    // D:/PROJECT/apps/app1/tsconfig.app.json
    tsConfig: path.resolve(workspaceRoot, tsConfig),
    // [{replace:"", with: ""}]
    fileReplacements,
    skipTypeCheck: options.skipTypeCheck,
    assets: normalizeAssets(options.assets, workspaceRoot, options.outputPath),
    inserts: formattedInserts,
    alias: options.alias,
    inject: normalizedInject,
  };
}
