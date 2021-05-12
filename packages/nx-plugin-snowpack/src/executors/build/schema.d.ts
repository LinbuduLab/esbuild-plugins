export interface SnowpackBuildSchema {
  cwd?: string;
  workspaceRoot?: string;
  mountRoot: stirng;
  configPath: string;
  outputPath: string;
  watch: boolean;
}

export interface NormalizedSnowpackBuildSchema
  extends Required<SnowpackBuildSchema> {
  projectName: string;
  projectRoot: string;
  projectSourceRoot: string;
}
