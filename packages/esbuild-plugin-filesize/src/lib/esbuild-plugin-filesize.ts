import type { Plugin } from 'esbuild';
import type { ESBuildPluginFileSizeOption } from './normalize-option';
import { normalizeOption } from './normalize-option';

import fs from 'fs-extra';
import path from 'path';

import fileSize from 'filesize';
import gzipSize from 'gzip-size';
import terser from 'terser';

import dayjs from 'dayjs';

import boxenReporter from './reporter';

export function esbuildPluginFileSize(
  options: ESBuildPluginFileSizeOption = {}
): Plugin {
  const normalizedOptions = normalizeOption(options);
  const buildAt = dayjs().format('H:mm:ss A');

  const formatFileSize = (size: number): string =>
    fileSize(size, options.format);

  async function handleFileSizeDisplay(filePath: string) {
    const fileSizeBytes = fs.statSync(filePath).size;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const minifiedContent = (await terser.minify(fileContent)).code;

    const fileSize = formatFileSize(fileSizeBytes);
    const gzippedSize = formatFileSize(gzipSize.sync(fileContent));
    const minifiedSize = formatFileSize(minifiedContent.length);

    boxenReporter(normalizedOptions, {
      fileSize,
      fileName: filePath,
      minifiedSize,
      gzippedSize,
      buildAt,
      outputPath: filePath,
    });
  }

  return {
    name: 'fileSize',
    // waiting for buildEnd hook, too...
    async setup(build) {
      const { outdir, outfile } = build.initialOptions;

      if (outfile) {
        const originFilePath = path.resolve(outfile);

        if (!fs.existsSync(originFilePath)) {
          return;
        }

        await handleFileSizeDisplay(originFilePath);
      } else if (outdir) {
        const originDirPath = path.resolve(outdir);

        if (!fs.existsSync(originDirPath)) {
          return;
        }

        const files = fs
          .readdirSync(originDirPath)
          .filter((str) =>
            normalizedOptions.exclude.every((ex) => !str.match(ex))
          );

        for (const file of files) {
          await handleFileSizeDisplay(path.resolve(outdir, file));
        }
      }
    },
  };
}
