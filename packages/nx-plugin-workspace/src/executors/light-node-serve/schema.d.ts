import { AssetsItem, FileReplacement } from 'nx-plugin-devkit';

export interface LightNodeServeExecutorSchema {
  main: string;
  tsConfig: string;
  watch: boolean;
}

export interface NormalizedLightNodeServeExecutorSchema
  extends LightNodeServeExecutorSchema {}
