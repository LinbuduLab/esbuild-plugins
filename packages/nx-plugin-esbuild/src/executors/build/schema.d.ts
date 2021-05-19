import type {
  AssetsItem,
  AssetFileInputOutput,
  FileReplacement,
  Alias,
} from 'nx-plugin-devkit';
import type { BuildOptions } from 'esbuild';
import type { Insert, FormattedInsert } from './lib/types';

// TODO: options to support
// √：options integrated
// × options that will not be integrated
// TODO: JSX auto import support
// focusing on node currently
// Define √
// Format √
// Inject√
// Loader
// Outdir & Outfile √
// Platform √
// Splitting
// Target
// Write ×
// Asset Names
// Charset ×
// Chunk names
// Global name
// Log level & limit √
// Out extensions
// Outbase
// Public path
// Resolve Extensions
// Source root
// Tree shaking

// TODO: tree-shaking、pure、img-process

export interface ESBuildExecutorSchema {
  // required options
  main: string;
  tsConfig: string;
  pluginConfig?: string;
  allowExtend: boolean;
  outputPath: string;

  assets: string[] | AssetsItem[];
  inserts: string[] | Insert[];
  fileReplacements: FileReplacement[];
  alias: Record<string, string>;

  // optional options with default values
  watch: boolean;
  skipTypeCheck: boolean;
  format: 'iife' | 'cjs' | 'esm';
  platform: 'browser' | 'node' | 'neutral';
  sourceMap: boolean | 'external' | 'inline' | 'both';
  logLevel: 'info' | 'warning' | 'error' | 'silent';
  logLimit: number;
  metaFile: boolean;
  bundle: boolean;
  // default as "all", and will use esbuild-plugin-node-externals as handler
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
  // https://github.com/xz64/license-webpack-plugin
  extractLicenses: boolean;

  // plugin options
  decoratorHandler: 'tsc' | 'swc';
  // control by externalDependencies
  // externalPlugin: boolean;

  // TODO: add plugins below to schema when buildEnd hook released.
  // TODO: support plugin options
  // fileSize: boolean;

  htmlPlugin: boolean;
  ignorePlugin: boolean;
  notifierPlugin: boolean;
  circularDepsPlugin: boolean;
}

export interface NormalizedESBuildExecutorSchema extends ESBuildExecutorSchema {
  projectName: string;
  workspaceRoot: string;
  projectRoot: string;
  projectSourceRoot: string;
  assets: AssetFileInputOutput[];
  inserts: FormattedInsert;
  alias: Record<string, string>;
  inject: string[];
  extendBuildOptions: BuildOptions;
}
