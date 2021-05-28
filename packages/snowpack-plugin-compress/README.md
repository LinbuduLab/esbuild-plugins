# snowpack-plugin-compress

Snowpack plugin for built files compression.

## Usage

**GitHub Repository/Homepage is private for now, if you got any troubles, just open issue in this [repo](https://github.com/linbudu599/Blog).**

```bash
npm i snowpack-plugin-compress -D
pnpm i snowpack-plugin-compress -D
yarn add snowpack-plugin-compress -D
```

```javascript
/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  plugins: [
    [
      'snowpack-plugin-compress',
      {
        exclude: ['assets/**/*', '_snowpack/**/*'],
      },
    ],
  ]
};
```

- This plugin will apply compression to **all files under build directory**, you can use `exclude` to filter files.
- When only one compression is enabled(gzip or brotli), compressed file will be output in `{snowpack.buildDir}/{plugin.distDir}`(e.g. `build/compressed`). When both are enabled, will be in `{snowpack.buildDir}/{plugin.distDir}/{gzipCompressDist}` and `{snowpack.buildDir}/{plugin.distDir}/{brotliCompressDist}`(e.g. `build/compressed/gzip`)

## Configuration

```typescript
export interface CompressPluginOptions {
  // enable gzip compress
  // default: true
  gzip?: boolean;
  // gzip options
  // default: {}
  gzipOptions?: ZlibOptions;
  // enable brotli compress
  // default: true
  brotli?: boolean;
  // brotli options
  // default: {}
  brotliOptions?: BrotliOptions;
  // extra globby options for file matching 
  // default: {}
  globbyOptions?: GlobbyOptions;
  // relative to buildDirectory
  // default: compressed
  distDir?: string;
  // inside distDir
  // default: gzip
  gzipCompressDist?: string;
  // inside distDir
  // default: brotli
  brotliCompressDist?: string;
  // should clean up distDir on exists?
  // default: true
  cleanOnExists?: boolean;
  // exclude files to apply compression
  exclude?: string[];
}
```
