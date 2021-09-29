export interface SnowpackSharedSchema {
  root?: string;
  workspaceRoot?: string;
  // if provided, load config
  // else, use internal configurations
  configPath?: string;
}

export interface NormalizedSnowpackSharedSchema {
  workspaceRoot: string;

  absoluteRoot: string;
  projectName: string;
  projectRoot: string;
  projectSourceRoot: string;
}

export interface RunnerResponse {
  success: boolean;
  error?: any;
}
