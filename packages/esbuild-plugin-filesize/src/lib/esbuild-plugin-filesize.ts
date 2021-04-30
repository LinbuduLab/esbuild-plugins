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
  const normalizeOptions = normalizeOption(options);

  const formatFileSize = (size: number): string =>
    fileSize(size, normalizeOptions.format);

  return {
    name: 'fileSize',
    // waiting for buildEnd hook, too...
    async setup(build) {
      const { outdir, outfile = 'main.js' } = build.initialOptions;

      const originFilePath = path.join(outdir, outfile);

      // TODO: handle edge cases: inexist...

      const fileSizeBytes = fs.statSync(originFilePath).size;
      const fileContent = fs.readFileSync(originFilePath, 'utf8');
      const minifiedContent = (await terser.minify(fileContent)).code;

      const fileSize = formatFileSize(fileSizeBytes);
      const gzippedSize = formatFileSize(gzipSize.sync(fileContent));
      const minifiedSize = formatFileSize(minifiedContent.length);

      const buildAt = dayjs().format('H:mm:ss A');

      boxenReporter(normalizeOptions, {
        fileSize,
        fileName: outfile,
        minifiedSize,
        gzippedSize,
        buildAt,
        outputPath: originFilePath,
      });
    },
  };
}
