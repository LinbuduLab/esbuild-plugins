import { AssetsItem, FileReplacement } from 'nx-plugin-devkit';

export interface LightNodeServeExecutorSchema {
  main: string;
  tsConfig: string;
  watch: boolean;
  // ts-node options
  preferTsExts: boolean;
  transpileOnly: boolean;
  logError: boolean;
  registerPath: boolean;
  compiler: string;
  skipProject: boolean;
  skipIgnore: boolean;
  emit: boolean;

  // node-dev options
  clearConsole: boolean;
  debounce: number;
  deps: number;
  timestamp: string;
  vm: boolean;
  ignore: string[];
}

export interface NormalizedLightNodeServeExecutorSchema
  extends LightNodeServeExecutorSchema {}
