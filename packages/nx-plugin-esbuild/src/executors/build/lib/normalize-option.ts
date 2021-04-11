import { basename, dirname, relative, resolve } from 'path';
import { ESBuildExecutorSchema, FileReplacement } from '../schema';

import type { InitializeOptions } from 'esbuild';
import { statSync } from 'fs';

// normalizeBuildExecutorOptions
export function normalizeBuildExecutorOptions(
  // partial or generic types
  options: ESBuildExecutorSchema,
  esbuildOptions: InitializeOptions,
  root: string,
  sourceRoot: string,
  projectRoot: string
) {
  // D:/PROJECT
  // apps/app1/src
  // apps/app1
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
    // assets: normalizeAssets(options.assets, root, sourceRoot),
    assets: options.assets,
  };
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
  return fileReplacements
    ? fileReplacements.map((fileReplacement) => ({
        replace: resolve(root, fileReplacement.replace),
        with: resolve(root, fileReplacement.with),
      }))
    : [];
}
