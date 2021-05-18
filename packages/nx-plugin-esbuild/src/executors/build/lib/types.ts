import type { BuildOptions, BuildResult, BuildFailure } from 'esbuild';
import type { AssetFileInputOutput } from 'nx-plugin-devkit';
import { BuildExecutorEvent } from 'nx-plugin-workspace';

// import {} from 'esbuild-plugin-alias-path';
// import {} from 'esbuild-plugin-clean';
// import {} from 'esbuild-plugin-compress';
// import {} from 'esbuild-plugin-copy';
// import {} from 'esbuild-plugin-decorator';
// import {} from 'esbuild-plugin-filesize';
// import {} from 'esbuild-plugin-node-externals';
// import {} from 'esbuild-plugin-notifier';
// import {} from 'esbuild-plugin-node-polyfill';
// import {} from 'esbuild-plugin-markdown-import';
// import {} from 'esbuild-plugin-yaml-import';
// import {} from 'esbuild-plugin-svgr-import';
// import {} from 'esbuild-plugin-graphql';
// import {} from 'esbuild-plugin-ignore-module';
// import {} from 'esbuild-plugin-html';
// import {} from 'esbuild-plugin-run';

export interface NXESBuildConfigExport extends BuildOptions {}

// aliasPath: '';
// clean: '';
// compress: '';
// copy: '';
// decorator: '';
// decorator: '';

export type Insert = {
  banner: boolean;
  applyToJSFile: boolean;
  content: string;
};

export const a = 1;
export const func = () => {
  console.log('');
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

export interface ESBuildBuildEvent extends BuildExecutorEvent {}

export interface RunnerSubcriber {
  success: boolean;
  messageFragments: string[];
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
