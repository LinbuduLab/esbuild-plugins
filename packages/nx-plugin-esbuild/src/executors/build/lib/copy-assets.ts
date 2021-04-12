import { logger } from '@nrwl/devkit';
import {
  AssetsItem,
  ESBuildExecutorSchema,
  FileReplacement,
  FileInputOutput,
} from '../schema';
import { copy } from 'fs-extra';

export default async function copyAssetFiles(assets: FileInputOutput[]) {
  logger.info('Copying asset files...');
  try {
    await Promise.all(assets.map((file) => copy(file.input, file.output)));
    logger.info('Done copying asset files.');
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
