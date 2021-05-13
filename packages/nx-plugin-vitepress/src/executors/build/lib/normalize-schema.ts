import fs from 'fs-extra';
import path from 'path';
import { ExecutorContext } from '@nrwl/devkit';
import { BuildOptions, UserConfig } from 'vite';
import {
  VitepressBuildSchema,
  NormalizedVitepressBuildSchema,
} from '../schema';
import merge from 'lodash/merge';
import { allowTs } from '../../../utils/allow-ts';

export const normalizeSchema = (
  schema: VitepressBuildSchema,
  context: ExecutorContext
): NormalizedVitepressBuildSchema => {
  allowTs();

  // TODO:
  let buildOptions: BuildOptions = {
    outDir: schema.outDir,
    assetsDir: schema.assetsDir,
    assetsInlineLimit: schema.assetsInlineLimit,
    sourcemap: schema.sourcemap,
    minify: schema.minify,
    write: schema.write,
    manifest: schema.manifest,
    brotliSize: schema.brotliSize,
    watch: schema.watch
      ? {
          buildDelay: 200,
        }
      : null,
  };

  if (
    schema.viteConfigPath &&
    fs.existsSync(path.resolve(process.cwd(), schema.viteConfigPath))
  ) {
    const viteConfig: UserConfig = require(path.resolve(
      process.cwd(),

      schema.viteConfigPath
    )).default;
    buildOptions = merge(buildOptions, viteConfig.build);
  }

  return {
    ...schema,
    buildOptions,
  };
};
