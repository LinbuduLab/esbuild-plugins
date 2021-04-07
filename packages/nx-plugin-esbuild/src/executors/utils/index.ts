import { basename, dirname, relative, resolve } from 'path';
import { ESBuildExecutorSchema, FileReplacement } from 'nx-plugin-esbuild';
import {
  findConfigFile,
  parseConfigFileTextToJson,
  ParsedCommandLine,
  parseJsonConfigFileContent,
  sys,
} from 'typescript';
import type { InitializeOptions } from 'esbuild';
import { statSync } from 'fs';
import { red } from 'chalk';

// normalizeBuildExecutorOptions
function normalizeBuildExecutorOptions(
  // partial or generic types
  options: ESBuildExecutorSchema,
  esbuildOptions: InitializeOptions,
  root: string,
  sourceRoot: string,
  projectRoot: string
) {
  return {
    ...options,
    root,
    sourceRoot,
    projectRoot,
    main: resolve(root, options.main),
    outputPath: resolve(root, options.outputPath),
    tsConfig: resolve(root, options.tsConfig),
    esbuild: {
      bundle: options.bundle,
      watch: options.watch,
      ...options.esbuild,
      ...esbuildOptions,
    },
    fileReplacements: normalizeFileReplacements(root, options.fileReplacements),
    assets: normalizeAssets(options.assets, root, sourceRoot),
  };
}

function parseTSConfig(tsconfig, cwd = process.cwd()): ParsedCommandLine {
  const fileName = findConfigFile(cwd, sys.fileExists, tsconfig);

  // if the value was provided, but no file, fail hard
  if (tsconfig !== undefined && !fileName)
    throw new Error(`failed to open '${fileName}'`);

  let loadedConfig = {};
  let baseDir = cwd;
  if (fileName) {
    const text = sys.readFile(fileName);
    if (text === undefined) throw new Error(`failed to read '${fileName}'`);

    const result = parseConfigFileTextToJson(fileName, text);

    if (result.error !== undefined) {
      console.error(red(result.error));
      throw new Error(`failed to parse '${fileName}'`);
    }

    loadedConfig = result.config;
    baseDir = dirname(fileName);
  }

  const parsedTsConfig = parseJsonConfigFileContent(loadedConfig, sys, baseDir);

  if (parsedTsConfig.errors[0]) console.error(red(parsedTsConfig.errors));

  return parsedTsConfig;
}

function normalizeAssets(
  assets: any[],
  root: string,
  sourceRoot: string
): any[] {
  if (!Array.isArray(assets)) {
    return [];
  }
  return assets.map((asset) => {
    if (typeof asset === 'string') {
      const resolvedAssetPath = resolve(root, asset);
      const resolvedSourceRoot = resolve(root, sourceRoot);

      if (!resolvedAssetPath.startsWith(resolvedSourceRoot)) {
        throw new Error(
          `The ${resolvedAssetPath} asset path must start with the project source root: ${sourceRoot}`
        );
      }

      const isDirectory = statSync(resolvedAssetPath).isDirectory();
      const input = isDirectory
        ? resolvedAssetPath
        : dirname(resolvedAssetPath);
      const output = relative(resolvedSourceRoot, resolve(root, input));
      const glob = isDirectory ? '**/*' : basename(resolvedAssetPath);
      return {
        input,
        output,
        glob,
      };
    } else {
      if (asset.output.startsWith('..')) {
        throw new Error(
          'An asset cannot be written to a location outside of the output path.'
        );
      }

      const resolvedAssetPath = resolve(root, asset.input);
      return {
        ...asset,
        input: resolvedAssetPath,
        // Now we remove starting slash to make Webpack place it from the output root.
        output: asset.output.replace(/^\//, ''),
      };
    }
  });
}

function normalizeFileReplacements(
  root: string,
  fileReplacements: FileReplacement[]
): FileReplacement[] {
  return fileReplacements.map((fileReplacement) => ({
    replace: resolve(root, fileReplacement.replace),
    with: resolve(root, fileReplacement.with),
  }));
}
