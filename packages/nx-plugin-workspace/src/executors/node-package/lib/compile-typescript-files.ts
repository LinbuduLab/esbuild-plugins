import { ExecutorContext } from '@nrwl/devkit';
import {
  createTmpTsConfig,
  DependentBuildableProjectNode,
} from '@nrwl/workspace/src/utilities/buildable-libs-utils';
import { compileTypeScript } from './compilation';
import { join } from 'path';
import { NormalizedBuilderOptions } from './models';

export default function compileTypeScriptFiles(
  options: NormalizedBuilderOptions,
  context: ExecutorContext,
  libRoot: string,
  projectDependencies: DependentBuildableProjectNode[]
) {
  let tsConfigPath = join(context.root, options.tsConfig);
  // 使用临时的tsconfig构建依赖
  if (projectDependencies.length > 0) {
    // 创建WORKSPACE_ROOT/tmp/PROJECT_TO_BUILD/tsconfig.generated.json
    // 注意：在这个过程中会重新映射path、extends等配置性来避免错误
    tsConfigPath = createTmpTsConfig(
      tsConfigPath,
      context.root,
      libRoot,
      projectDependencies
    );
  }

  return compileTypeScript({
    outputPath: options.normalizedOutputPath,
    projectName: context.projectName,
    projectRoot: libRoot,
    tsConfig: tsConfigPath,
    deleteOutputPath: options.deleteOutputPath,
    rootDir: options.srcRootForCompilationRoot,
    watch: options.watch,
  });
}
