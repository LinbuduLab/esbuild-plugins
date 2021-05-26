export interface IceSharedCLIArgs {
  analyzer: boolean;
  analyzerPort: number;
  config: string;
}

export interface IceStartCLIArgs extends IceSharedCLIArgs {
  port: number;
  host: string;
  https: boolean;
  disableReload: boolean;
  disableMock: boolean;
  disableOpen: boolean;
  disableAssets: boolean;
}

export interface IceBuildCLIArgs extends IceSharedCLIArgs {
  deleteOutputPath: boolean;
}

export interface ExecutorRes {
  success: boolean;
}

export interface BuildExecutorRes extends ExecutorRes {
  outfile?: string;
}
