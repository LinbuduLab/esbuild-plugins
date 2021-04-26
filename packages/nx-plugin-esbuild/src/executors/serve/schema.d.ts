export const enum InspectType {
  Inspect = 'inspect',
  InspectBrk = 'inspect-brk',
}

export interface ESBuildServeExecutorSchema {
  buildTarget: string;
  waitUntilTargets: string[];
  host: string;
  port: number;
  watch: boolean;
  inspect: boolean | InspectType;
  runtimeArgs: string[];
  args: string[];
}

export interface NormalizedESBuildServeExecutorSchema
  extends ESBuildServeExecutorSchema {
  execArgs: string[];
}
