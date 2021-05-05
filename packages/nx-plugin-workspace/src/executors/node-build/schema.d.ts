import { AssetsItem, FileReplacement } from 'nx-plugin-devkit';
import { WebpackBasedExecutorSchema } from '../../utils';

export interface NodeBuildExecutorSchema extends WebpackBasedExecutorSchema {
  optimization?: boolean;
  sourceMap?: boolean;
  externalDependencies: 'all' | 'none' | string[];
  buildLibsFromSource?: boolean;
  generatePackageJson?: boolean;

  runWaitUntilTargets: string[];
}

export interface NormalizedNodeBuildExecutorSchema
  extends NodeBuildExecutorSchema {
  webpackConfig: string[];
}
