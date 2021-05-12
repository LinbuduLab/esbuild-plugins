export interface SnowpackBuildSchema {
  // root workspaceRoot
  cwd: string;
  workspace: string;
  mountRoot: stirng;
  configPath: string;
  outputPath: string;
  watch: boolean;
}
