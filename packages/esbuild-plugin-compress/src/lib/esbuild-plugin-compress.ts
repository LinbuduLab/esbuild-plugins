import { Plugin } from 'esbuild';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { gzipSync, brotliCompressSync, BrotliOptions, ZlibOptions } from 'zlib';

export interface CompressOptions {
  gzip?: boolean;
  gzipOptions?: ZlibOptions;
  brotli?: boolean;
  brotliOptions?: BrotliOptions;
  removeOrigin?: boolean;
  outputDir?: string;
  // TODO:
  // exclude?: string | string[];
  // sync?: boolean;
  // assets by copy plugin
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
  const gzip = options.gzip ?? true;
  const brotli = options.brotli ?? true;
  const removeOrigin = options.removeOrigin ?? false;
  const gzipOpts = options.gzipOptions ?? {};
  const brotliOpts = options.brotliOptions ?? {};

  const noCompressSpecified = !gzip && !brotli;

  let outputDir = options.outputDir ?? null;

  return {
    name: 'plugin:compress',
    setup({ initialOptions: { outfile, outdir, write }, onEnd }) {
      if (write) {
        console.log(
          chalk.yellow('WARN'),
          ' Set write option as false to use compress plugin.'
        );
        return;
      }

      if (outputDir && !outdir && !outfile) {
        console.log(
          chalk.yellow('WARN'),
          ' When using outputDir option, outdir or outfile must be specified.'
        );
      } else if (outputDir && outfile) {
        outputDir = path.resolve(path.dirname(outfile), outputDir);
      } else if (outputDir && outdir) {
        outputDir = path.resolve(outdir, outputDir);
      }

      onEnd(async ({ outputFiles }) => {
        for (const { path: originOutputPath, contents } of outputFiles) {
          const writePath = outputDir
            ? path.resolve(outputDir, path.basename(originOutputPath))
            : originOutputPath;

          if (!contents) {
            return;
          }

          if (noCompressSpecified) {
            console.log(
              chalk.yellow('WARN'),
              ' Set at least one compression as true to use compress plugin.'
            );
          } else {
            fs.ensureDirSync(path.dirname(writePath));
          }

          gzip ? writeGzipCompress(writePath, contents, gzipOpts) : void 0;
          brotli
            ? writeBrotliCompress(writePath, contents, brotliOpts)
            : void 0;

          if (!removeOrigin || noCompressSpecified) {
            writeOriginFiles(originOutputPath, contents);
          }
        }
      });
    },
  };
};
