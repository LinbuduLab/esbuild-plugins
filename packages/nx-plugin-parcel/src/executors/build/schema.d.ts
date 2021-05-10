import { ParcelGeneralParams, ParcelBuildParams } from '../utils/types';

export interface ParcelBuildSchema
  extends ParcelGeneralParams,
    ParcelBuildParams {
  cwd: string;
}

export interface NormalizedParcelBuildSchema
  extends Partial<ParcelBuildSchema> {
  projectName: string;
  projectRoot: string;
  projectSourceRoot: string;
}

// export interface BuildExecutorSchema {} // eslint-disable-line

// // TODO: extract shared parts with serve executor
// export interface ParcelBuildExecutorSchema {
//   entryFiles: string | string[];
//   outDir?: string;
//   outFile?: string;
//   cache: boolean;
//   cacheDir?: string;
//   contentHash: boolean;
//   minify: boolean;
//   scopeHoist: boolean;
//   target: 'browser' | 'node' | 'electron';
//   logLevel: 1 | 2 | 3;
//   sourceMaps: boolean;
//   bundleNodeModules: boolean;
//   hmr: boolean;
//   autoInstall: boolean;
// }

// export interface NormalizedParcelBuildExecutorSchema
//   extends ParcelBuildExecutorSchema {
//   entryFiles: string | string[];
//   outDir?: string;
//   outFile?: string;
//   cache: boolean;
//   cacheDir?: string;
//   contentHash: boolean;
//   minify: boolean;
//   scopeHoist: boolean;
//   target: 'browser' | 'node' | 'electron';
//   logLevel: 1 | 2 | 3;
//   sourceMaps: boolean;
//   bundleNodeModules: boolean;
//   hmr: boolean;
//   autoInstall: boolean;
// }
