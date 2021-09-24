import { ExecutorContext, ProjectGraphNode } from '@nrwl/devkit';
import { readCachedProjectGraph } from '@nrwl/workspace/src/core/project-graph';
import { copyAssetFiles } from '@nrwl/workspace/src/utilities/assets';
import {
  calculateProjectDependencies,
  checkDependentProjectsHaveBeenBuilt,
  DependentBuildableProjectNode,
  updateBuildableProjectPackageJsonDependencies,
} from '@nrwl/workspace/src/utilities/buildable-libs-utils';

import {
  NodePackageBuilderOptions,
  NormalizedBuilderOptions,
} from './lib/models';
import compileTypeScriptFiles from './lib/compile-typescript-files';
import updatePackageJson from './lib/update-package-json';
import normalizeOptions from './lib/normalize-options';
import addCliWrapper from './lib/cli';
import { PackageExecutorRes, PROJECT_GRAPH_VERSION } from './lib/utils';

export async function packageExecutor(
  options: NodePackageBuilderOptions,
  context: ExecutorContext
): Promise<PackageExecutorRes> {
  const libRoot = context.workspace.projects[context.projectName].root;
  const normalizedOptions = normalizeOptions(options, context, libRoot);

  const { target, dependencies } = calculateProjectDependencies(
    readCachedProjectGraph(PROJECT_GRAPH_VERSION),
    context.root,
    context.projectName,
    context.targetName,
    context.configurationName
  );

  const dependentsBuilt = checkDependentProjectsHaveBeenBuilt(
    context.root,
    context.projectName,
    context.targetName,
    dependencies
  );

  if (!dependentsBuilt) {
    // FIXME: reason?
    throw new Error();
  }

  const result: { success: boolean } = await compileTypeScriptFiles(
    normalizedOptions,
    context,
    libRoot,
    dependencies,
    async () =>
      await updatePackageAndCopyAssets(
        normalizedOptions,
        context,
        target,
        dependencies
      )
  );

  if (options.cli) {
    addCliWrapper(normalizedOptions, context);
  }

  return {
    ...result,
    outputPath: normalizedOptions.outputPath,
  };
}

export default packageExecutor;

async function updatePackageAndCopyAssets(
  options: NormalizedBuilderOptions,
  context: ExecutorContext,
  target: ProjectGraphNode<any>,
  dependencies: DependentBuildableProjectNode[]
) {
  await copyAssetFiles(options.files);

  updatePackageJson(options, context);

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
      options.buildableProjectDepsInPackageJsonType
    );
  }
}
