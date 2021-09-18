export interface ESBuildInfoExecutorSchema {
  // PROJECT:TARGET:CONFIGURATION
  buildTarget?: string;
  serveTarget?: string;
}

export interface NormalizedESBuildInfoExecutorSchema {
  buildTarget: string;
  serveTarget: string;
}
