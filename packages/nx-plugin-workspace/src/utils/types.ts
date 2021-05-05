import { AssetsItem, FileReplacement } from 'nx-plugin-devkit';

export type BuildExecutorEvent = {
  success: boolean;
  outfile: string;
};

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
  fileReplacements: FileReplacement[];
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

export const enum InspectType {
  Inspect = 'inspect',
  InspectBrk = 'inspect-brk',
}

export interface NodeAppServeExecutorSchema {
  buildTarget: string;
  waitUntilTargets: string[];
  host: string;
  port: number;
  watch: boolean;
  inspect: boolean | InspectType;
  runtimeArgs: string[];
  args: string[];
}
