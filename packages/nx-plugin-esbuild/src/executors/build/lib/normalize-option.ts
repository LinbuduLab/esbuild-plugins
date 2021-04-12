import { basename, resolve, join } from 'path';
import {
  AssetsItem,
  ESBuildExecutorSchema,
  FileReplacement,
  FileInputOutput,
  NormalizedESBuildExecutorSchema,
  FormattedInsert,
  Insert,
} from '../schema';

import type { InitializeOptions } from 'esbuild';
import glob from 'glob';

// normalizeBuildExecutorOptions
export function normalizeBuildExecutorOptions(
  // partial or generic types
  options: ESBuildExecutorSchema,
  esbuildOptions: InitializeOptions,
  root: string,
  sourceRoot: string,
  projectRoot: string
): NormalizedESBuildExecutorSchema {
  const { banner, footer } = normalizeInserts(options.insert);

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
      banner,
      footer,
    },
    fileReplacements: normalizeFileReplacements(root, options.fileReplacements),
    assets: normalizeAssets(options.assets, root, options.outputPath),
  };
}

export function normalizeInserts(
  inserts: Array<Insert | string>
): FormattedInsert {
  const formattedInserts: FormattedInsert = { footer: {}, banner: {} };

  // TODO: check content starts with "//"

  inserts
    .filter(
      (insert) =>
        typeof insert === 'string' || typeof insert.content === 'string'
    )
    .forEach((insert) => {
      typeof insert === 'string'
        ? (formattedInserts['banner']['js'] = insert)
        : (formattedInserts[insert.banner ? 'banner' : 'footer'][
            insert.isJSFile ? 'js' : 'css'
          ] = insert.content);
    });

  return formattedInserts;
}

export function globFile(
  pattern: string,
  input = '',
  ignore: string[] = []
): string[] {
  return glob.sync(pattern, { cwd: input, ignore });
}

function normalizeAssets(
  assets: string[] | AssetsItem[],
  root: string,
  outDir: string
): FileInputOutput[] {
  const files: FileInputOutput[] = [];

  if (!Array.isArray(assets)) {
    return [];
  }

  assets.forEach((asset: string | AssetsItem) => {
    if (typeof asset === 'string') {
      globFile(asset, root).forEach((globbedFile) => {
        files.push({
          input: join(root, globbedFile),
          output: join(root, outDir, basename(globbedFile)),
        });
      });
    } else {
      globFile(asset.glob, join(root, asset.input), asset.ignore).forEach(
        (globbedFile) => {
          files.push({
            input: join(root, asset.input, globbedFile),
            output: join(root, outDir, asset.output, globbedFile),
          });
        }
      );
    }
  });

  return files;

  // return assets.map((asset) => {
  //   if (typeof asset === 'string') {
  //     const resolvedAssetPath = resolve(root, asset);
  //     const resolvedSourceRoot = resolve(root, sourceRoot);

  //     if (!resolvedAssetPath.startsWith(resolvedSourceRoot)) {
  //       throw new Error(
  //         `The ${resolvedAssetPath} asset path must start with the project source root: ${sourceRoot}`
  //       );
  //     }

  //     const isDirectory = statSync(resolvedAssetPath).isDirectory();
  //     const input = isDirectory
  //       ? resolvedAssetPath
  //       : dirname(resolvedAssetPath);
  //     const output = relative(resolvedSourceRoot, resolve(root, input));
  //     const glob = isDirectory ? '**/*' : basename(resolvedAssetPath);
  //     return {
  //       input,
  //       output,
  //       glob,
  //     };
  //   } else {
  //     if (asset.output.startsWith('..')) {
  //       throw new Error(
  //         'An asset cannot be written to a location outside of the output path.'
  //       );
  //     }

  //     const resolvedAssetPath = resolve(root, asset.input);
  //     return {
  //       ...asset,
  //       input: resolvedAssetPath,
  //       // Now we remove starting slash to make Webpack place it from the output root.
  //       output: asset.output.replace(/^\//, ''),
  //     };
  //   }
  // });
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
