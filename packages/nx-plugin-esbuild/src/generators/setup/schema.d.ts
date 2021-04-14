import { TargetConfiguration } from '@nrwl/devkit';

export interface ESBuildSetupGeneratorSchema {
  app: string;
  override: boolean;
  entry: string;
  watch: boolean;
  tsconfigPath: string;
  outputPath: string;
  useTSCPluginForDecorator: boolean;
}

export interface NormalizedESBuildSetupGeneratorSchema
  extends ESBuildSetupGeneratorSchema {
  projectRoot: string;
  projectSourceRoot: string;
  buildTargetConfig: TargetConfiguration;
  assets: string[];
}
