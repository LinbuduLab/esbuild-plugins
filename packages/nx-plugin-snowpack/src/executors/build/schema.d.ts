export interface SnowpackBuildSchema {
  cwd?: string;
  workspaceRoot?: string;
  mountRoot: stirng;
  configPath: string;
  outputPath: string;
  watch: boolean;
  clearCache: boolean;
  verbose: boolean;
}

export interface NormalizedSnowpackBuildSchema extends SnowpackBuildSchema {
  absCwd: string;
  projectName: string;
  projectRoot: string;
  projectSourceRoot: string;
}
