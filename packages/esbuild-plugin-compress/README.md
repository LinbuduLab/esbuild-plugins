# esbuild-plugin-compress

ESBuild plugin for output compression (gzip/brotli).

- [Author](https://github.com/linbudu599)
- [GitHub Repo](https://github.com/LinbuduLab/esbuild-plugins/tree/master/packages/esbuild-plugin-compress#readme)
- [Changelog](https://github.com/LinbuduLab/esbuild-plugins/blob/main/packages/esbuild-plugin-compress/CHANGELOG.md)

## Usage

```bash
npm install esbuild-plugin-compress --save-dev
pnpm install esbuild-plugin-compress --save-dev
yarn add esbuild-plugin-compress --save-dev
```

**You must set `write` options to be false to use this plugin, as ESBuild only expose `outputFile` info when setting false `write` options.**

```typescript
import { build } from 'esbuild';
import { compress } from 'esbuild-plugin-compress';

import type { BuildOptions } from 'esbuild';

const baseOptions: BuildOptions = {
  entryPoints: ['./src/index.ts'],
  outfile: './build/index.js',
};

const compressOptions: BuildOptions = {
  ...baseOptions,
  write: false,
  plugins: [
    ...(baseOptions.plugins ?? []),
    compress({
      outputDir: 'dist',
      exclude: ['**/*.map'],
    }),
  ],
};

build(baseOptions).catch(() => process.exit(1));

build(compressOptions).catch(() => process.exit(1));
```

## Configurations

```typescript
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
```
