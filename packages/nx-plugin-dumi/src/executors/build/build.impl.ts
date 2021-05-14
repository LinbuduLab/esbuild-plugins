import { DumiBuildSchema } from './schema';
import { Service } from 'umi/lib/ServiceWithBuiltIn';
import initWebpack from './lib/initWebpack';
import path from 'path';

export default async function runExecutor(options: DumiBuildSchema) {
  process.env.NODE_ENV = 'production';
  process.env.UMI_PRESETS = require.resolve('@umijs/preset-dumi');
  process.env.APP_ROOT = path.resolve(options.cwd);

  const cwdPath = path.resolve(options.cwd);

  initWebpack(options.cwd);

  const service = new Service({
    cwd: cwdPath,
    pkg: require(path.resolve(cwdPath, 'package.json')),
  });

  await service.run({
    name: 'build',
    args: {},
  });

  console.log('Executor ran for Build', options);
  return {
    success: true,
  };
}
