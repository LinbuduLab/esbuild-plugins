import fs from 'fs-extra';
import { readJsonFile } from '@nrwl/workspace';
import type { BuildOptions } from 'esbuild';
import { allowTs } from 'nx-plugin-devkit';
import { NXESBuildConfigExport } from './types';
import { register } from '@adonisjs/require-ts';

// TODO: enable extends configurations from apps/app1/nx-esbuild.js|ts file
export function normalizeESBuildExtendConfig(
  root: string,
  configPath: string,
  allowExtend = true
) {
  console.log('root: ', root);

  register(root, {
    cache: false,
  });

  const x = require(configPath);
  console.log(x);

  return x.default as BuildOptions;
  // allowTs(['terser']);

  // if (fs.existsSync(configPath)) {
  //   // delete require.cache[configPath];

  //   console.log(require(configPath).default);
  //   // console.log(import(configPath));
  //   // console.log(await import(configPath));
  // }

  // const esBuildExtendConfigFileExists = fs.pathExistsSync(configPath);

  // return allowExtend
  //   ? esBuildExtendConfigFileExists
  //     ? readJsonFile<Partial<BuildOptions>>(configPath)
  //     : {}
  //   : {};
}
