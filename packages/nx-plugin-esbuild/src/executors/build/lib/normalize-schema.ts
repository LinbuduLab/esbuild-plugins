import path from 'path';

import type {
  ESBuildExecutorSchema,
  NormalizedESBuildExecutorSchema,
  AliasReplacement,
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

export function fileReplacements2Alias(
  fileReplacements: FileReplacement[]
): Record<string, string> {
  return fileReplacements.reduce(
    (composedAliases, { replace, with: target }) => ({
      ...composedAliases,
      [replace]: target,
    }),
    {}
  );
}

export function tmpNormalizeAlias(
  aliasReplacement: AliasReplacement[]
): Record<string, string> {
  return aliasReplacement.reduce(
    (composedAliases, { from, to }) => ({
      ...composedAliases,
      [from]: to,
    }),
    {}
  );
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

  // TODO: 计算fileReplace到main.ts的路径，得到导入路径
  // const aliases = fileReplacements2Alias(options.fileReplacements);
  const aliases = tmpNormalizeAlias(options.aliases);

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
