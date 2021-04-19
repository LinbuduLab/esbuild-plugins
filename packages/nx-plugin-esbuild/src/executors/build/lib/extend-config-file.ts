import fs from 'fs-extra';

import { readJsonFile } from '@nrwl/workspace';

import type { BuildOptions } from 'esbuild';

// TODO: enable extends configurations from apps/app1/nx-esbuild.json|js|ts file
export function normalizeESBuildExtendConfig(
  configPath: string,
  projectRoot: string,
  allowExtend = true
): Partial<BuildOptions> {
  const esBuildExtendConfigFileExists = fs.pathExistsSync(configPath);

  return allowExtend
    ? esBuildExtendConfigFileExists
      ? readJsonFile<Partial<BuildOptions>>(configPath)
      : {}
    : {};
}
