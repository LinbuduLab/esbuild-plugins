import { TargetConfiguration } from '@nrwl/devkit';

export interface ESBuildSetupGeneratorSchema {
  app: string;
  override: boolean;
  watch: boolean;
  entry?: string;
  tsconfigPath?: string;
  outputPath?: string;
  useTSCPluginForDecorator: boolean;
}

export interface NormalizedESBuildSetupGeneratorSchema
  extends ESBuildSetupGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectSourceRoot: string;
  buildTargetConfig: TargetConfiguration;
  serveTargetConfig: TargetConfiguration;
  assets: string[];
}
