import type { Plugin } from 'esbuild';
import type {
  ESBuildPluginFileSizeOption,
  FileSizeFormatOption,
} from './normalize-option';
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
  const buildAt = dayjs().format('H:mm:ss A');

  const formatFileSize = (size: number): string =>
    fileSize(size, options.format);

  function handleFileSizeDisplay(fileName: string, filePath: string) {
    const fileSizeBytes = fs.statSync(filePath).size;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const minifiedContent = terser.minify(fileContent).code;

    const fileSize = formatFileSize(fileSizeBytes);
    const gzippedSize = formatFileSize(gzipSize.sync(fileContent));
    const minifiedSize = formatFileSize(minifiedContent.length);

    boxenReporter(normalizeOptions, {
      fileSize,
      fileName,
      minifiedSize,
      gzippedSize,
      buildAt,
      outputPath: filePath,
    });
  }

  return {
    name: 'fileSize',
    // waiting for buildEnd hook, too...
    setup(build) {
      const { outdir, outfile } = build.initialOptions;

      // 对于outfile 直接读取
      // 对于outdir 读取目录下所有文件并显示体积
      // 支持exclude选项

      const originFilePath = path.resolve(outfile);

      if (!fs.existsSync(originFilePath)) {
        return;
      }

      // TODO: handle edge cases: inexist...

      handleFileSizeDisplay(outfile, originFilePath);
    },
  };
}
