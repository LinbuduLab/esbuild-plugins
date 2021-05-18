import fs from 'fs-extra';
import { readJsonFile } from '@nrwl/workspace';
import type { BuildOptions } from 'esbuild';
import { allowTs } from 'nx-plugin-devkit';
import { NXESBuildConfigExport } from './types';

// TODO: enable extends configurations from apps/app1/nx-esbuild.js|ts file
export function normalizeESBuildExtendConfig(
  configPath: string,
  allowExtend = true
) {
  allowTs();

  if (fs.existsSync(configPath)) {
    delete require.cache[configPath];

    console.log(require(configPath).default);
  }

  // const esBuildExtendConfigFileExists = fs.pathExistsSync(configPath);

  // return allowExtend
  //   ? esBuildExtendConfigFileExists
  //     ? readJsonFile<Partial<BuildOptions>>(configPath)
  //     : {}
  //   : {};
}
