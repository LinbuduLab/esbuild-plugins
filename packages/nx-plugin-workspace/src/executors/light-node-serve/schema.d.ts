import { AssetsItem, FileReplacement } from 'nx-plugin-devkit';

export interface LightNodeServeExecutorSchema {
  main: string;
  tsConfig: string;
  outputPath: string;
  watch: boolean;

  assets: (AssetsItem | string)[];
  fileReplacements: FileReplacement[];
}

export interface NormalizedLightNodeServeExecutorSchema
  extends LightNodeServeExecutorSchema {
  assets: AssetsItem[];
}
