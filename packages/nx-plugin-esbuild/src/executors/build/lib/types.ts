import type { BuildOptions, BuildResult, BuildFailure } from 'esbuild';
import { copyAssetFiles, AssetFileInputOutput } from 'nx-plugin-devkit';

export type Insert = {
  banner: boolean;
  applyToJSFile: boolean;
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

export interface ESBuildRunnerOptions extends BuildOptions {
  assets: AssetFileInputOutput[];
}

export interface ESBuildRunnerResponse {
  buildResult: BuildResult | null;
  buildFailure: BuildFailure | null;
}

export interface TscRunnerOptions {
  tsconfigPath: string;
  watch: boolean;
  root: string;
}

export interface TscRunnerResponse {
  info?: string;
  error?: string;
  tscError?: Error;
  end?: string;
}
