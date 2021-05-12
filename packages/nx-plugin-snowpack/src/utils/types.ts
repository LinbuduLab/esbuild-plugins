export interface RunnerResponse {
  success: boolean;
}

export interface SnowpackSharedSchema {
  cwd?: string;
  workspaceRoot?: string;
  mountRoot: string;
  configPath: string;
}

export interface NormalizedSnowpackSharedSchema {
  absCwd: string;
  projectName: string;
  projectRoot: string;
  projectSourceRoot: string;
}
