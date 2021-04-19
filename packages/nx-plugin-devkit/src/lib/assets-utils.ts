import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';

export type FileInputOutput = {
  input: string;
  output: string;
};

export type AssetsItem = {
  input: string;
  glob: string;
  output: string;
  ignore: string[];
};

export function globFile(
  pattern: string,
  input = '',
  ignore: string[] = []
): string[] {
  return glob.sync(pattern, { cwd: input, ignore });
}

export function normalizeAssets(
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
}

export async function copyAssetFiles(assets: FileInputOutput[]) {
  try {
    await Promise.all(assets.map((file) => fs.copy(file.input, file.output)));
    console.log('Done copying asset files.');
    return {
      success: true,
    };
  } catch (err) {
    return {
      error: err.message,
      success: false,
    };
  }
}
