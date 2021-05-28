import {
  SnowpackConfig,
  SnowpackPlugin,
  SnowpackPluginFactory,
  logger,
} from 'snowpack';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import globby, { GlobbyOptions } from 'globby';
import { gzipSync, brotliCompressSync, BrotliOptions, ZlibOptions } from 'zlib';

export interface CompressPluginOptions {
  gzip?: boolean;
  gzipOptions?: ZlibOptions;
  brotli?: boolean;
  brotliOptions?: BrotliOptions;
  globbyOptions?: GlobbyOptions;
  // relative to buildDirectory
  distDir?: string;
  // inside distDir
  gzipCompressDist?: string;
  // inside distDir
  brotliCompressDist?: string;
  cleanOnExists?: boolean;
  exclude?: string[];
}

export type CompressPlugin = SnowpackPluginFactory<CompressPluginOptions>;

const writeGzipCompress = (
  path: string,
  contents: Uint8Array,
  options: ZlibOptions = {}
) => {
  const gzipped = gzipSync(contents, options);
  fs.writeFileSync(`${path}.gz`, gzipped);
};

const writeBrotliCompress = (
  path: string,
  contents: Uint8Array,
  options: BrotliOptions = {}
) => {
  const gzipped = brotliCompressSync(contents, options);
  fs.writeFileSync(`${path}.br`, gzipped);
};

export const snowpackPluginCompress: CompressPlugin = (
  snowpackConfig: SnowpackConfig,
  pluginOptions: CompressPluginOptions
): SnowpackPlugin => {
  const {
    gzip = true,
    brotli = true,
    gzipOptions = {},
    brotliOptions = {},
    globbyOptions = {},
    distDir = 'compressed',
    gzipCompressDist = 'gzip',
    brotliCompressDist = 'brotli',
    cleanOnExists = true,
    exclude = [],
  } = pluginOptions;

  const compressHandler = (
    originPath: string,
    gzipCompressPath: string,
    brotliCompressPath: string
  ) => {
    fs.ensureDirSync(path.dirname(gzipCompressPath));
    fs.ensureDirSync(path.dirname(brotliCompressPath));

    const originContent = fs.readFileSync(originPath);

    gzip
      ? writeGzipCompress(gzipCompressPath, originContent, gzipOptions)
      : void 0;
    brotli
      ? writeBrotliCompress(brotliCompressPath, originContent, brotliOptions)
      : void 0;
  };

  return {
    name: 'plugin:compress',
    async optimize({ buildDirectory }) {
      if (!gzip && !brotli) {
        return;
      }

      const outputDir = path.resolve(buildDirectory, distDir);

      if (cleanOnExists && fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, {
          force: true,
          recursive: true,
        });
      }

      const files = globby.sync(['**/*'], {
        cwd: buildDirectory,
        ignore: exclude,
        ...globbyOptions,
      });

      const formattedFilePairs = files.map((f) => {
        if ((gzip && !brotli) || (!gzip && brotli)) {
          return {
            originPath: path.resolve(buildDirectory, f),
            compressPath: path.resolve(outputDir, f),
          };
        }

        return {
          originPath: path.resolve(buildDirectory, f),
          gzipCompressPath: path.resolve(outputDir, gzipCompressDist, f),
          brotliCompressPath: path.resolve(outputDir, brotliCompressDist, f),
        };
      });

      for (const {
        originPath,
        compressPath,
        gzipCompressPath,
        brotliCompressPath,
      } of formattedFilePairs) {
        compressPath
          ? compressHandler(originPath, compressPath, compressPath)
          : compressHandler(originPath, gzipCompressPath, brotliCompressPath);
      }
      logger.info('compression finished.', {
        name: 'plugin:compress',
      });
    },
  };
};

export default snowpackPluginCompress;
