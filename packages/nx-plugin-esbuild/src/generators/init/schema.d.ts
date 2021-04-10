export interface InitGeneratorSchema {
  name: string;
  tags?: string;
  directory?: string;
}

export interface ESBuildInitGeneratorSchema {
  name: string;
  type: 'application' | 'library';
  entry: string;
  watch: boolean;
  tsconfigPath: string;
  outputPath: string;
  useTSCPluginForDecorator: boolean;
}

export interface NormalizedESBuildInitGeneratorSchema
  extends ESBuildInitGeneratorSchema {
  projectRoot: string;
  isApp: boolean;
}
