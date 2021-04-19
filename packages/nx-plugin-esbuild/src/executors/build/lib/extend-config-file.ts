import fs from 'fs-extra';

import { readJsonFile } from '@nrwl/workspace';

import type { BuildOptions } from 'esbuild';

export function normalizeESBuildExtendConfig(
  configPath: string,
  root: string,
  allowExtend = true
): Partial<BuildOptions> {
  const esBuildExtendConfigFileExists = fs.pathExistsSync(configPath);

  return allowExtend
    ? esBuildExtendConfigFileExists
      ? readJsonFile<Partial<BuildOptions>>(configPath)
      : {}
    : {};
}
