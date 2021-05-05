import { AssetsItem, FileReplacement } from 'nx-plugin-devkit';

// TODO: extract to nx-plugin-devkit ?

export interface OptimizationOptions {
  scripts: boolean;
  styles: boolean;
}

export interface SourceMapOptions {
  scripts: boolean;
  styles: boolean;
  vendors: boolean;
  hidden: boolean;
}

export interface WebpackBasedExecutorSchema {
  main: string;
  tsConfig: string;
  outputPath: string;

  watch?: boolean;
  poll?: number;
  progress?: boolean;
  assets?: (AssetsItem | string)[];
  showCircularDependencies?: boolean;
  optimization?: boolean | OptimizationOptions;
  sourceMap?: boolean | SourceMapOptions;
  maxWorkers?: number;
  memoryLimit?: number;
  statsJson?: boolean;
  verbose?: boolean;
  extractLicenses?: boolean;

  webpackConfig?: string | string[];
}

export interface NodeBuildExecutorSchema extends WebpackBasedExecutorSchema {
  optimization?: boolean;
  sourceMap?: boolean;
  externalDependencies: 'all' | 'none' | string[];
  buildLibsFromSource?: boolean;
  generatePackageJson?: boolean;
}

export interface NormalizedNodeBuildExecutorSchema
  extends NodeBuildExecutorSchema {
  webpackConfig: string[];
}
