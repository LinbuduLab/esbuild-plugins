import type { InitializeOptions, BuildOptions } from 'esbuild';
// import { FileReplacement } from '../../utils/normalize-options';

export interface FileReplacement {
  replace: string;
  with: string;
}

export type FileInputOutput = {
  input: string;
  output: string;
};

export interface AssetsItem {
  input: string;
  glob: string;
  output: string;
  ignore: string[];
}

export interface Insert {
  // true
  banner?: boolean;
  // true
  isJSFile?: boolean;
  content: string;
}

export type InsertFileType = 'js' | 'css';

export interface FormattedInsert {
  banner: {
    [key: InsertFileType]: string;
  };
  footer: {
    [key: InsertFileType]: string;
  };
}

export interface ESBuildExecutorSchema {
  // options provide for ESBuild
  esbuild?: Partial<BuildOptions>;
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
  // insert
  insert?: Insert[] | string[];
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
  assets?: string[] | AssetsItem[];

  externalDependencies: 'all' | 'none' | string[];
}

export interface NormalizedESBuildExecutorSchema extends ESBuildExecutorSchema {
  esbuild: Partial<BuildOptions>;
  root: string;
  sourceRoot: string;
  projectRoot: string;
  assets: FileInputOutput[];
}
