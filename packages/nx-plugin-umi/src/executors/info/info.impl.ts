import { UmiInfoExecutorSchema } from './schema';
import { umiPlugin, umiVersion, umiWebpack } from '../utils/umi-cli';

// plugin
// version
// webpack

// TODO: if cwd is not provided, use project.projectRoot

export default async function runExecutor(options: UmiInfoExecutorSchema) {
  const { cwd, plugin, version, webpack, verboseWebpackReport } = options;

  if (plugin) {
    await umiPlugin(cwd);
  }

  if (version) {
    await umiVersion(cwd);
  }

  if (webpack) {
    await umiWebpack(cwd, verboseWebpackReport);
  }

  return {
    success: true,
  };
}
