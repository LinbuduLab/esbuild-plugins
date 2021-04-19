import type {
  BasicNodeAppGenSchema,
  BasicNormalizedAppGenSchema,
} from 'nx-plugin-devkit';

export interface ESBuildInitGeneratorExtraSchema {
  watch: boolean;
  useTSCPluginForDecorator: boolean;
  // TODO: add to schema.json
  entry: string;
  outputPath: string;
  tsconfigPath: string;
  assets: string[];
}

export interface ESBuildInitGeneratorSchema
  extends BasicNodeAppGenSchema,
    Partial<ESBuildInitGeneratorExtraSchema> {}

export interface NormalizedESBuildInitGeneratorSchema
  extends BasicNormalizedAppGenSchema,
    Required<ESBuildInitGeneratorExtraSchema> {}
