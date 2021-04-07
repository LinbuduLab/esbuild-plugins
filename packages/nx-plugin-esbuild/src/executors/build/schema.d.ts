import type { InitializeOptions } from 'esbuild';
// import { FileReplacement } from '../../utils/normalize-options';

export interface FileReplacement {
  replace: string;
  with: string;
}

export interface AssetsItem {
  input: string;
  glob: string;
  output: string;
}

export interface ESBuildExecutorSchema {
  // options provide for ESBuild
  esbuild?: Partial<InitializeOptions>;
  // forceTSC on project globally where decorators are detected?
  decoratorOptions?: Partial<any>;
  //
  skipTypeCheck?: boolean;
  // file entry like main.ts
  // absolute path
  main: string;
  // absolute path
  outputPath: string;
  // absolute path
  packageJson: string;
  // absolute path
  tsConfig: string;
  // watch option is avaliable for serve/build
  watch?: boolean;
  // use esbuild bundle mode?
  bundle?: boolean;
  // Webpack is for typechecking
  webpackConfig?: string;
  // project configurations
  root?: string;
  sourceRoot?: string;
  projectRoot?: string;

  // ?
  buildLibsFromSource?: boolean;

  // assets should be copied
  fileReplacements: FileReplacement[];
  assets?: any[];

  // ?
  externalDependencies: 'all' | 'none' | string[];
}

export interface BuildExecutorSchema {
  entryPoint: string;
  outDir: string;
  tsConfig: string;
  assets: string[];
}
