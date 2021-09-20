import type {
  BasicNodeAppGenSchema,
  BasicNormalizedAppGenSchema,
} from 'nx-plugin-devkit';

export interface ESBuildInitGeneratorExtraSchema {
  watch: boolean;

  entry: string;
  outputPath: string;
  tsconfigPath: string;
  assets: string[];

  bundle: boolean;
  platform: 'browser' | 'node' | 'neutral';
  decoratorHandler: 'tsc' | 'swc';
}

export interface ESBuildInitGeneratorSchema
  extends BasicNodeAppGenSchema,
    Partial<ESBuildInitGeneratorExtraSchema> {}

export interface NormalizedESBuildInitGeneratorSchema
  extends BasicNormalizedAppGenSchema,
    Required<ESBuildInitGeneratorExtraSchema> {}
