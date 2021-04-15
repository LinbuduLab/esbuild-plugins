import { copy } from 'fs-extra';

export type FileInputOutput = {
  input: string;
  output: string;
};

export async function copyAssetFiles(assets: FileInputOutput[]) {
  try {
    await Promise.all(assets.map((file) => copy(file.input, file.output)));
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
