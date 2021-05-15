import fs from 'fs-extra';
import path from 'path';
import { ExecutorContext } from '@nrwl/devkit';
import { UserConfig, ServerOptions } from 'vite';
import { VitepressDevSchema, NormalizedVitepressDevSchema } from '../schema';
import merge from 'lodash/merge';
import { allowTs } from '../../../utils/allow-ts';

// As vitepress under devekoping, there'll be more options in the future
export const normalizeSchema = (
  schema: VitepressDevSchema,
  context: ExecutorContext
): NormalizedVitepressDevSchema => {
  allowTs();

  // TODO: 对于watch等选项的路径做特殊处理
  let serverOptions: ServerOptions = {
    watch: schema.watch ?? {
      cwd: schema.root,
      ignorePermissionErrors: false,
    },
  };

  if (
    schema.viteConfigPath &&
    fs.existsSync(path.resolve(schema.root, schema.viteConfigPath))
  ) {
    const viteConfig: UserConfig = require(path.resolve(
      schema.root,
      schema.viteConfigPath
    )).default;
    serverOptions = merge(serverOptions, viteConfig.server);
  }

  return {
    ...schema,
    serverOptions,
  };
};
