export interface ParcelGeneralParams {
  entryFiles: string | string[];
  cacheDir: string;
  distDir: string;
  logLevel: 'none' | 'error' | 'warn' | 'info' | 'verbose';
  noCache: boolean;
  noSourceMaps: boolean;
  profile: boolean;
  publicUrl: string;
  target: string;
  reporter: string;
}

export interface ParcelServeWatchParams {
  noHmr: boolean;
  port: number;
  hmrPort: number;
  host: string;
  https: boolean;
  cert: string;
  key: string;
  noAutoInstall: boolean;
  watchForStdin: boolean;
}

export interface ParcelServeParams {
  open: boolean;
}

export interface ParcelBuildParams {
  noOptimize: boolean;
  noScopeHoist: boolean;
  detailedReport: number;
  noContentHash: boolean;
}
