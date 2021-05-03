import {
  ExecutorContext,
  readWorkspaceConfiguration,
  readTargetOptions,
  readProjectConfiguration,
  readJson,
} from '@nrwl/devkit';
import envinfo from 'envinfo';
import path from 'path';
import jsonfile from 'jsonfile';
import execa from 'execa';
import { ESBuildInfoExecutorSchema } from './schema';
import { normalizeInfoExecutorSchema } from './lib/normalize-schema';
import { nxReportHandler, envInfo } from 'nx-plugin-devkit';
// info executor：
// nx esinfo project1
// nx report
// +
// esbuild、esbuild插件的版本
// 合并esbuild-nx.json后的配置
// +
// envinfo 输出

// esbuild、esbuild插件 依赖版本
// esbuild配置
// esbuild插件配置
// 当前project相关信息
// nx相关信息

export default async function infoExecutor(
  rawOptions: ESBuildInfoExecutorSchema,
  context: ExecutorContext
) {
  const {
    sourceRoot: projectSourceRoot,
    root: projectRoot,
  } = context.workspace.projects[context.projectName];

  if (!projectSourceRoot) {
    throw new Error(`${context.projectName} does not have a sourceRoot.`);
  }

  if (!projectRoot) {
    throw new Error(`${context.projectName} does not have a root.`);
  }

  const options = normalizeInfoExecutorSchema(rawOptions, context);

  console.log(`Project build target: ${options.buildTarget}`);
  console.log(`Project serve target: ${options.serveTarget}`);

  nxReportHandler();

  const envInfos = await envInfo([
    'nx-plugin-esbuild',
    'nx-plugin-devkit',
    'esbuild',
    'esbuild-plugin-decorator',
    'esbuild-plugin-node-externals',
    'esbuild-plugin-alias-path',
  ]);

  console.log(envInfos);

  return {
    success: true,
  };
}
