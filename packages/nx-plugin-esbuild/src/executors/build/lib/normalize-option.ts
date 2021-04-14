import path from 'path';
import fs from 'fs-extra';
import { ExecutorContext, getWorkspaceLayout } from '@nrwl/devkit';

import { readJsonFile } from '@nrwl/workspace';
import type {
  AssetsItem,
  ESBuildExecutorSchema,
  FileReplacement,
  FileInputOutput,
  NormalizedESBuildExecutorSchema,
  FormattedInsert,
  Insert,
  MetaConfig,
} from '../schema';
import type { BuildOptions } from 'esbuild';
import glob from 'glob';

export function normalizeBuildExecutorOptions(
  options: ESBuildExecutorSchema,
  workspaceRoot: string,
  projectName: string,
  sourceRoot: string,
  projectRoot: string
): NormalizedESBuildExecutorSchema {
  const { banner, footer } = normalizeInserts(options.insert ?? []);
  const { main, outputPath, tsConfig } = normalizeMetaConfig(
    options.main,
    options.outputPath,
    options.tsConfig,
    projectName
  );

  // TODO: extend config
  // TODO: support js/ts file
  const esbuildExtendConfig = normalizeESBuildExtendConfig(
    `${workspaceRoot}/nx-esbuild.json`,
    workspaceRoot
  );

  return {
    ...options,
    // D:/PROJECT
    workspaceRoot,
    // apps/app1/src
    sourceRoot,
    // apps/app1
    projectRoot,
    // D:/PROJECT/apps/app1/src/main.ts
    main: path.resolve(workspaceRoot, main),
    // D:/PROJECT/dist/app1
    outputPath: path.resolve(workspaceRoot, outputPath),
    // D:/PROJECT/apps/app1/tsconfig.app.json
    tsConfig: path.resolve(workspaceRoot, tsConfig),
    fileReplacements: normalizeFileReplacements(
      workspaceRoot,
      options.fileReplacements
    ),
    skipTypeCheck: options.skipTypeCheck ?? false,
    assets: normalizeAssets(options.assets, workspaceRoot, options.outputPath),
    esbuild: {
      bundle: options.bundle ?? true,
      watch: options.watch ?? false,
      ...options.esbuild,
      ...esbuildExtendConfig,
      // TODO: should br merged
      banner,
      footer,
    },
  };
}

// FIXME: executor cannot get workspace layout, so 'apps' will be used only.
export function normalizeMetaConfig(
  main: string,
  outputPath: string,
  tsConfig: string,
  projectName: string
): MetaConfig {
  // TODO: log param missing cases and tips
  return {
    main: main ?? `apps/${projectName}/src/main.ts`,
    outputPath: outputPath ?? `dist/apps/${projectName}`,
    tsConfig: tsConfig ?? `apps/${projectName}/tsconfig.app.json`,
  };
}

export function normalizeESBuildExtendConfig(
  configPath: string,
  root: string,
  allowExtend = true
): Partial<BuildOptions> {
  const esBuildExtendConfigFileExists = fs.pathExistsSync(configPath);

  return allowExtend
    ? esBuildExtendConfigFileExists
      ? readJsonFile<Partial<BuildOptions>>(configPath)
      : {}
    : {};
}

export function normalizeInserts(
  inserts: Array<Insert | string>
): FormattedInsert {
  const formattedInserts: FormattedInsert = { footer: {}, banner: {} };

  inserts
    .filter(
      (insert) =>
        typeof insert === 'string' || typeof insert.content === 'string'
    )
    .forEach((insert) => {
      const content = typeof insert === 'string' ? insert : insert.content;

      typeof insert === 'string'
        ? (formattedInserts['banner']['js'] = content)
        : (formattedInserts[insert.banner ? 'banner' : 'footer'][
            insert.applyToJSFile ? 'js' : 'css'
          ] = content);
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
          input: path.join(root, globbedFile),
          output: path.join(root, outDir, path.basename(globbedFile)),
        });
      });
    } else {
      globFile(asset.glob, path.join(root, asset.input), asset.ignore).forEach(
        (globbedFile) => {
          files.push({
            input: path.join(root, asset.input, globbedFile),
            output: path.join(root, outDir, asset.output, globbedFile),
          });
        }
      );
    }
  });

  return files;

  // return assets.map((asset) => {
  //   if (typeof asset === 'string') {
  //     const resolvedAssetPath = path.resolve(root, asset);
  //     const resolvedSourceRoot = path.resolve(root, sourceRoot);

  //     if (!resolvedAssetPath.startsWith(resolvedSourceRoot)) {
  //       throw new Error(
  //         `The ${resolvedAssetPath} asset path must start with the project source root: ${sourceRoot}`
  //       );
  //     }

  //     const isDirectory = statSync(resolvedAssetPath).isDirectory();
  //     const input = isDirectory
  //       ? resolvedAssetPath
  //       : dirname(resolvedAssetPath);
  //     const output = relative(resolvedSourceRoot, path.resolve(root, input));
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

  //     const resolvedAssetPath = path.resolve(root, asset.input);
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
        replace: path.resolve(root, fileReplacement.replace),
        with: path.resolve(root, fileReplacement.with),
      }))
    : [];
}
