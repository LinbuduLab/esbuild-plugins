export interface ESBuildInitGeneratorSchema {
  name: string;
  directory?: string;
  watch?: boolean;
  useTSCPluginForDecorator?: boolean;
  tags?: string;
}

export interface NormalizedESBuildInitGeneratorSchema
  extends ESBuildInitGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  offsetFromRoot: string;

  // build option
  main: string;
  outputPath: string;
  tsConfigPath: string;
  assets: string[];
}
