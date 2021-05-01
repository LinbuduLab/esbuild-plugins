import {
  ExecutorContext,
  readWorkspaceConfiguration,
  readTargetOptions,
  readProjectConfiguration,
  readJson,
} from '@nrwl/devkit';
import path from 'path';
import jsonfile from 'jsonfile';
import { ESBuildInfoExecutorSchema } from './schema';
import { normalizeInfoExecutorSchema } from './lib/normalize-schema';

// info executor：
// esbuild、esbuild插件 依赖版本
// esbuild配置
// esbuild插件配置
// 当前project相关信息

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

  // TODO: error handle
  const rootPackageJsonContent = jsonfile.readFileSync(
    path.resolve(context.root, 'package.json')
  );

  const deps = {
    ...rootPackageJsonContent['devDependencies'],
    ...rootPackageJsonContent['dependencies'],
  };

  const depNames = Object.keys(deps);
  if (!depNames.includes('esbuild')) {
    console.log(
      'ESBuild was not installed. Run nx g nx-plugin-esbuild:setup to xxx, or run nx g nx-plugin-esbuild:init to xxx'
    );
    return {
      success: false,
    };
  }

  // find from lock file?
  console.log(`ESBuild Version: ${deps['esbuild']}`);

  return {
    success: true,
  };
}
