import type {
  AssetsItem,
  AssetFileInputOutput,
  FileReplacement,
  Alias,
} from 'nx-plugin-devkit';
import type { BuildOptions, Loader } from 'esbuild';
import type { Insert, FormattedInsert } from './lib/types';
import type { WatchOptions } from 'chokidar';

// TODO: options to support
// √：options integrated
// × options that will not be integrated
// TODO: JSX auto import support
// focusing on node currently
// Define √
// Format √
// Inject √
// Loader √
// Outdir √
// OutFile
// Platform √
// Splitting √
// Target √
// Write √
// Asset Names
// Charset ×
// Chunk names
// Global name
// Log level & limit √
// Out extensions √
// Outbase
// Public path
// Resolve Extensions
// Source root
// Tree shaking

// TODO: tree-shaking、pure、img-process

export interface ESBuildExecutorSchema {
  verbose: boolean;

  // required options
  main: string;
  tsconfigPath: string;

  // output
  outputPath?: string;

  // extend nx-esbuild BuildOptions
  extendConfigPath?: string;

  failFast: boolean;
  watchAssetsDir: boolean;
  watchDir: string | string[];
  clearOutputPath: boolean;
  useMergeCombine: boolean;

  assets: string[] | AssetsItem[];
  inserts: string[] | Insert[];
  fileReplacements: FileReplacement[];
  alias: Record<string, string>;

  // ESBuild BuildOptions
  watch: boolean;
  write: boolean;
  outExtension: Record<string, string>;
  splitting: boolean;
  skipTypeCheck: boolean;
  format: 'iife' | 'cjs' | 'esm';
  platform: 'browser' | 'node' | 'neutral';
  sourceMap: boolean | 'external' | 'inline' | 'both';
  logLevel: 'info' | 'warning' | 'error' | 'silent';
  logLimit: number;
  loader: Record<string, Loader>;
  target: string[];
  metaFile: boolean;
  bundle: boolean;
  // default as "all"
  externalDependencies: 'all' | 'none' | string[];

  inject: string | string[];

  // "'true'" >>> "true"
  // "true" >>> true
  // "[]" >>> []
  // "'[]'" ??? "[]"
  define?: {
    [key: string]: string;
  };

  skipTypeCheck: boolean;

  // nx options
  buildLibsFromSource: boolean;
  generatePackageJson: boolean;

  // optimization options
  minify: boolean;
}

export interface NormalizedESBuildExecutorSchema extends ESBuildExecutorSchema {
  projectName: string;
  absoluteWorkspaceRoot: string;
  projectRoot: string;
  projectSourceRoot: string;
  assets: AssetFileInputOutput[];
  inserts: FormattedInsert;
  alias: Record<string, string>;
  inject: string[];
  watchDir: string[];
  extendBuildOptions: BuildOptions;
  extendWatchOptions: WatchOptions;
}
