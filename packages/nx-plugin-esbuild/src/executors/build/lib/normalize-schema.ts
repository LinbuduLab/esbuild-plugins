import path from 'path';

import type {
  ESBuildExecutorSchema,
  NormalizedESBuildExecutorSchema,
  Alias,
} from '../schema';

import {
  normalizeAssets,
  normalizeFileReplacements,
  FileReplacement,
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

// TODO: move to devkit
export function fileReplacements2Alias(
  fileReplacements: FileReplacement[],
  projectSourceRoot: string,

  workspaceRoot: string
) {
  const aliases: Alias[] = [];

  fileReplacements.forEach(({ replace, with: target }) => {
    const normalizeReplacePath = replace.replaceAll('\\', '/');
    const normalizeSourcePath = projectSourceRoot.replaceAll('\\', '/');

    const aliasFrom = normalizeReplacePath

      .split(`${normalizeSourcePath}/`)[1]
      .replace('.ts', '');

    const aliasFromRegExp = new RegExp(aliasFrom);
    const aliasTo = path.resolve(workspaceRoot, target);
    aliases.push({
      from: aliasFromRegExp,
      to: aliasTo,
    });
  });

  return aliases;
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

  const fileReplacements = normalizeFileReplacements(
    workspaceRoot,
    options.fileReplacements
  );

  const aliases = fileReplacements2Alias(
    options.fileReplacements,
    projectSourceRoot,
    workspaceRoot
  );

  return {
    ...options,
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
    // D:/PROJECT/apps/app1/tsconfig.app.json
    tsConfig: path.resolve(workspaceRoot, tsConfig),
    // [{replace:"", with: ""}]
    fileReplacements,
    skipTypeCheck: options.skipTypeCheck,
    assets: normalizeAssets(options.assets, workspaceRoot, options.outputPath),
    inserts: formattedInserts,
    aliases,
  };
}
