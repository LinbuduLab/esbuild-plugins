import type { Plugin } from 'esbuild';
import type {
  ESBuildPluginFileSizeOption,
  OutputFileSizeInfo,
} from './normalize-option';
import { normalizeOption } from './normalize-option';

import fs from 'fs-extra';
import path from 'path';

import fileSize from 'filesize';
import gzipSize from 'gzip-size';
import terser from 'terser';
import { sync as brotliSync } from 'brotli-size';

import {
  boxenSingleOutputReporter,
  boxenMultiOutputReporter,
} from './reporter';

export function esbuildPluginFileSize(
  options: ESBuildPluginFileSizeOption = {}
): Plugin {
  const normalizedOptions = normalizeOption(options);

  const formatFileSize = (size: number): string =>
    fileSize(size, normalizedOptions.format);

  async function handleFileSizeDisplay(filePath: string) {
    const fileSizeBytes = fs.statSync(filePath).size;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const minifiedContent = (await terser.minify(fileContent)).code;

    const fileSize = formatFileSize(fileSizeBytes);
    const gzippedSize = formatFileSize(gzipSize.sync(fileContent));
    const minifiedSize = formatFileSize(minifiedContent.length);
    const brotliSize = formatFileSize(brotliSync(fileContent));
    return {
      fileSize,
      gzippedSize,
      minifiedSize,
      brotliSize,
    };
  }

  return {
    name: 'fileSize',
    // waiting for buildEnd hook, too...
    async setup({ initialOptions, onEnd }) {
      const { outdir, outfile } = initialOptions;

      onEnd(async () => {
        if (outfile) {
          const originFilePath = path.resolve(outfile);

          if (!fs.existsSync(originFilePath)) {
            return;
          }

          const {
            fileSize,
            minifiedSize,
            gzippedSize,
            brotliSize,
          } = await handleFileSizeDisplay(originFilePath);

          boxenSingleOutputReporter(normalizedOptions, {
            fileSize,
            fileName: originFilePath,
            minifiedSize,
            gzippedSize,
            outputPath: originFilePath,
            brotliSize,
          });
        } else if (outdir) {
          const originDirPath = path.resolve(outdir);

          if (!fs.existsSync(originDirPath)) {
            return;
          }

          const files = fs
            .readdirSync(originDirPath)
            .filter((str) =>
              normalizedOptions.exclude.every((ex) => !str.match(ex))
            )
            .map((filePath) => path.resolve(outdir, filePath));

          const infos: OutputFileSizeInfo[] = [];

          for (const file of files) {
            const tmp = await handleFileSizeDisplay(file);

            infos.push({
              ...tmp,
              fileName: file,
              outputPath: file,
            });
          }

          boxenMultiOutputReporter(normalizedOptions, infos);
        }
      });
    },
  };
}
