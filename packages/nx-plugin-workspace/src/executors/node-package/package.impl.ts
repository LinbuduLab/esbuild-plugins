import { ExecutorContext } from '@nrwl/devkit';
import { createProjectGraph } from '@nrwl/workspace/src/core/project-graph';
import { copyAssetFiles } from '@nrwl/workspace/src/utilities/assets';
import {
  calculateProjectDependencies,
  checkDependentProjectsHaveBeenBuilt,
  updateBuildableProjectPackageJsonDependencies,
} from '@nrwl/workspace/src/utilities/buildable-libs-utils';

import { NodePackageBuilderOptions } from './lib/models';
import compileTypeScriptFiles from './lib/compile-typescript-files';
import updatePackageJson from './lib/update-package-json';
import normalizeOptions from './lib/normalize-options';
import addCliWrapper from './lib/cli';

// Enhancement:
// FIXME: watch mode
// TODO: dev mode: auto-link、outputPath handle
// TODO: specify clear path
// TODO: BuildableProjectDeps?
// TODO: CLI Wrapper
// TODO: buildable-libs-utils source code

export async function packageExecutor(
  options: NodePackageBuilderOptions,
  context: ExecutorContext
) {
  // 当前工作区所有项目
  const projGraph = createProjectGraph();
  // 待构建的库root
  const libRoot = context.workspace.projects[context.projectName].root;

  const normalizedOptions = normalizeOptions(options, context, libRoot);
  // Target:
  // name: 'nx-plugin-esbuild',
  // type: 'lib',
  // data: {
  //   root: 'packages/nx-plugin-esbuild',
  //   sourceRoot: 'packages/nx-plugin-esbuild/src',
  //   projectType: 'library',
  //   targets: [Object] 项目targets,
  //   tags: [Array],
  //   files: [Array]
  // }
  // dependencies
  // name outputs(仅同属于工作区的项目会有此属性) node(类型同target)
  // 获取项目的依赖以及依赖信息
  const { target, dependencies } = calculateProjectDependencies(
    projGraph,
    context.root,
    context.projectName,
    context.targetName,
    context.configurationName
  );

  // 查看是否所有依赖都已构建完毕
  // 其实就是检查依赖的outputs，看是否有不存在的，有则说明未构建
  const dependentsBuilt = checkDependentProjectsHaveBeenBuilt(
    context.root,
    context.projectName,
    context.targetName,
    dependencies
  );
  if (!dependentsBuilt) {
    throw new Error();
  }

  const result = await compileTypeScriptFiles(
    normalizedOptions,
    context,
    libRoot,
    dependencies
  );

  await copyAssetFiles(normalizedOptions.files);

  updatePackageJson(normalizedOptions, context);

  if (
    dependencies.length > 0 &&
    options.updateBuildableProjectDepsInPackageJson
  ) {
    updateBuildableProjectPackageJsonDependencies(
      context.root,
      context.projectName,
      context.targetName,
      context.configurationName,
      target,
      dependencies,
      normalizedOptions.buildableProjectDepsInPackageJsonType
    );
  }

  if (options.cli) {
    addCliWrapper(normalizedOptions, context);
  }

  return {
    ...result,
    outputPath: normalizedOptions.outputPath,
  };
}

export default packageExecutor;
