import path from 'path';

import type {
  ESBuildExecutorSchema,
  NormalizedESBuildExecutorSchema,
} from '../schema';

import { normalizeESBuildExtendConfig } from './extend-config-file';

import { normalizeAssets, normalizeFileReplacements } from 'nx-plugin-devkit';
import { normalizeInserts } from './insert';
// import terminalLink from 'terminal-link';

// FIXME: executor cannot get workspace layout, so 'apps' will be used.
// Choose a random project to get its starts?
export function normalizeMetaConfig(
  main: string,
  outputPath: string,
  tsConfig: string,
  projectName: string,
  appsLayout: string
) {
  return {
    main: main ?? `${appsLayout}/${projectName}/src/main.ts`,
    outputPath: outputPath ?? `dist/${appsLayout}/${projectName}`,
    tsConfig: tsConfig ?? `${appsLayout}/${projectName}/tsconfig.app.json`,
  };
}

export function normalizeBuildExecutorOptions(
  options: ESBuildExecutorSchema,
  workspaceRoot: string,
  projectName: string,
  projectSourceRoot: string,
  projectRoot: string,
  appsLayout = 'apps'
): NormalizedESBuildExecutorSchema {
  const formattedInserts = normalizeInserts(options.inserts ?? []);

  const { main, outputPath, tsConfig } = normalizeMetaConfig(
    options.main,
    options.outputPath,
    options.tsConfig,
    projectName,
    appsLayout
  );

  // TODO: config file generator
  const pluginConfigPath = path.resolve(
    workspaceRoot,
    options.pluginConfig ?? 'nx-esbuild.ts'
  );

  const userConfigBuildOptions = options.allowExtend
    ? normalizeESBuildExtendConfig(
        path.resolve(workspaceRoot, projectRoot),
        pluginConfigPath
      )
    : {};

  if (options.platform === 'browser' && !options.format) {
    options.format = 'iife';
  }

  if (options.splitting && options.format !== 'esm') {
    // const link = terminalLink(
    //   'splitting',
    //   'https://esbuild.github.io/api/#splitting'
    // );
    // console.warn(
    //   `code-splitting is only available with esm format, check${link} for more details`
    // );
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
    extendBuildOptions: userConfigBuildOptions,
  };
}
