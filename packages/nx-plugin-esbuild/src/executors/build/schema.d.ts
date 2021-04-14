import type { BuildOptions } from 'esbuild';

export type FileReplacement = {
  replace: string;
  with: string;
};

export type FileInputOutput = {
  input: string;
  output: string;
};

export type AssetsItem = {
  input: string;
  glob: string;
  output: string;
  ignore: string[];
};

export type Insert = {
  banner?: boolean;
  applyToJSFile?: boolean;
  content: string;
};

export type InsertFileType = 'js' | 'css';

export interface FormattedInsert {
  banner: {
    [key in InsertFileType]?: string;
  };
  footer: {
    [key in InsertFileType]?: string;
  };
}

export interface MetaConfig {
  // file entry like main.ts
  // absolute path
  main: string;
  // absolute path
  outputPath: string;

  tsConfig: string;
}

export interface ESBuildExecutorSchema extends MetaConfig {
  // options provide for ESBuild
  esbuild?: Partial<BuildOptions>;
  // forceTSC on project globally where decorators are detected?
  decoratorOptions?: Partial<any>;

  skipTypeCheck?: boolean;

  packageJson: string;

  // watch option is avaliable for serve/build
  watch?: boolean;
  // insert
  insert?: Insert[] | string[];
  // use esbuild bundle mode?

  bundle?: boolean;
  // Webpack is for typechecking
  webpackConfig?: string;
  // project configurations
  workspaceRoot?: string;
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
  workspaceRoot: string;
  sourceRoot: string;
  projectRoot: string;
  assets: FileInputOutput[];
}
