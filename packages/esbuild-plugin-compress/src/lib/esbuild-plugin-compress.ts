import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import micromatch from 'micromatch';
import { gzipSync, brotliCompressSync } from 'zlib';

import type { Plugin } from 'esbuild';
import type { BrotliOptions, ZlibOptions } from 'zlib';

export interface CompressOptions {
  /**
   * enable gzip compress
   * @default true
   */
  gzip?: boolean;

  /**
   * gzip compress options passed to zlib.gzipSync
   */
  gzipOptions?: ZlibOptions;

  /**
   * enable brotli compress
   * @default true
   */
  brotli?: boolean;

  /**
   * brotli compress options passed to zlib.brotliCompressSync
   */
  brotliOptions?: BrotliOptions;
  /**
   * should write origin file
   * @default true
   */
  emitOrigin?: boolean;

  /**
   * the output of compressed file
   * if not specified, will resolve from outdir or outfile options
   */
  outputDir?: string;

  /**
   * exclude files from compression
   * works as micromatch.isMatch(outputPath, excludePatterns) under the hood
   * @default []
   */
  exclude?: string | string[];
}

const writeOriginFiles = (path: string, contents: Uint8Array) => {
  fs.writeFileSync(path, contents);
};

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

export const compress = (options: CompressOptions = {}): Plugin => {
  const {
    gzip = true,
    gzipOptions = {},
    brotli = true,
    brotliOptions = {},
    emitOrigin = true,
    exclude = [],
  } = options;

  const excludePatterns = Array.isArray(exclude) ? exclude : [exclude];

  const noCompressSpecified = !gzip && !brotli;

  let outputDir = options.outputDir ?? null;

  return {
    name: 'plugin:compress',
    setup({ initialOptions: { outfile, outdir, write }, onEnd }) {
      if (write === true) {
        console.log(
          chalk.yellow('WARN'),
          ' Set write option as false to use compress plugin.'
        );
        return;
      }

      if (noCompressSpecified) {
        console.log(
          chalk.yellow('WARN'),
          ' Set at least one compression as true to use compress plugin.'
        );
      }

      if (outputDir && !outdir && !outfile) {
        console.log(
          chalk.yellow('WARN'),
          ' When using outputDir option, outdir or outfile must be specified.'
        );
        // dist/compressed
      } else if (outputDir && outfile) {
        outputDir = path.resolve(path.dirname(outfile), outputDir);
      } else if (outputDir && outdir) {
        outputDir = path.resolve(outdir, outputDir);
      }

      function handler(originPath: string, contents: Uint8Array) {
        const writePath = outputDir
          ? path.resolve(outputDir, path.basename(originPath))
          : originPath;

        if (!contents?.length) {
          return;
        }

        fs.ensureDirSync(path.dirname(writePath));

        gzip ? writeGzipCompress(writePath, contents, gzipOptions) : void 0;
        brotli
          ? writeBrotliCompress(writePath, contents, brotliOptions)
          : void 0;
      }

      onEnd(async ({ outputFiles }) => {
        // handle single output separately
        // this happens when using outfile option or use outdir with bundle option
        if (outputFiles?.length === 1) {
          const { path: outputPath, contents } = outputFiles[0];
          if (!micromatch.isMatch(outputPath, excludePatterns)) {
            handler(outputPath, contents);
          }

          emitOrigin && writeOriginFiles(outputPath, contents);
        } else {
          for (const { path: outputPath, contents } of outputFiles) {
            if (!micromatch.isMatch(outputPath, excludePatterns)) {
              handler(outputPath, contents);
            }

            emitOrigin && writeOriginFiles(outputPath, contents);
          }
        }
      });
    },
  };
};
