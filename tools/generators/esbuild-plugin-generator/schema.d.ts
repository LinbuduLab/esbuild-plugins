import type {
  PluginGeneratorSchema,
  NormalizedPluginGeneratorSchema,
} from '../utils';

export interface ESBuildPluginGeneratorSchema extends PluginGeneratorSchema {}

// TODO: ESBuild options
export interface NormalizedESBuildPluginGeneratorSchema
  extends NormalizedPluginGeneratorSchema {}
