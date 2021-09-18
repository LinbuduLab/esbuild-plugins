# esbuild-plugin-compress

ESBuild plugin for output compression (gzip/brotli).

## Usage

**Node: this plugin require ESBuild version ^0.11.19 for the `onStart`/`onEnd` hooks**

**GitHub Repository/Homepage is private for now, if you got any troubles, just open issue in this [repo](https://github.com/linbudu599/Blog).**

```bash
npm i esbuild-plugin-compress -D
pnpm i esbuild-plugin-compress -D
yarn add esbuild-plugin-compress -D
```

```typescript
import { build } from 'esbuild';
import compress from 'esbuild-plugin-compress';

(async () => {
  const res1 = await build({
    entryPoints: ['./demo.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [
      compress({
        outputDir: 'compressed-dist',
        brotli: false,
      }),
    ],
  });
})();
```

## Configuration

```typescript
export interface CompressOptions {
  // apply gzip compression
  // default: true
  gzip?: boolean;
  // gzip options
  // default: {}
  gzipOptions?: ZlibOptions;
  // apply brotli compression
  // default: true
  brotli?: boolean;
  // brotli options
  // default: {}
  brotliOptions?: BrotliOptions;
  // should generate origin files
  // if no compression is specified, origin files will must be generated
  // default: false
  removeOrigin?: boolean;
  // output dir name, relative to outdir/outfile(path.dirname(outfile))
  // default: null, will generate compressed file at the same level of output file
  outputDir?: string;
}
```
