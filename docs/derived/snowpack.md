# Snowpack

## assets

Snowpack plugin for assets copy handle.

**Note: This plugin use `optimize` hook to copy assets, Snowpack doesn't invoke `optimize` hook' when `buildOptions.watch` is `true`.**

```bash
npm i snowpack-plugin-assets -D
pnpm i snowpack-plugin-assets -D
yarn add snowpack-plugin-assets -D
```

Example:

```text
assets:
  - x
    - x.txt
    - x-foo
      x-foo.txt
  - y
    - y.txt
    - y-bar
      y-bar.txt
```

```javascript
// snowpack.config.js
/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  plugins: [
    [
      'snowpack-plugin-assets',
      {
        assets: {
          from: ['assets/**', '!assets/x'],
          to: 'assets',
        },
      },
    ],
  ],
};
```

### Configuration

```typescript
type MaybeArray<T> = T | T[];

export interface AssetPair {
  // file / folder / globs
  from: MaybeArray<string>;
  to: MaybeArray<string>;
}

export interface AssetsPluginOptions {
  // assets pair to copy
  assets: MaybeArray<AssetPair>;
  // extra globby options for paths matching, will be passed to globby directly
  globbyOptions: GlobbyOptions;
}
```

## compress

Snowpack plugin for built files compression.

```bash
npm i snowpack-plugin-compress -D
pnpm i snowpack-plugin-compress -D
yarn add snowpack-plugin-compress -D
```

```javascript
// snowpack.config.js
/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  plugins: [
    [
      'snowpack-plugin-compress',
      {
        exclude: ['assets/**/*', '_snowpack/**/*'],
      },
    ],
  ],
};
```

- This plugin will apply compression to **all files under build directory**, you can use `exclude` to filter files.
- When only one compression is enabled(gzip or brotli), compressed file will be output in `{snowpack.buildDir}/{plugin.distDir}`(e.g. `build/compressed`). When both are enabled, generated directory will be like `{snowpack.buildDir}/{plugin.distDir}/{gzipCompressDist}` and `{snowpack.buildDir}/{plugin.distDir}/{brotliCompressDist}`(e.g. `build/compressed/gzip`)

### Configuration

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

## execa

# snowpack-plugin-execa

Use [execa](https://www.npmjs.com/package/execa) in snowpack `run` hook.

```bash
npm i snowpack-plugin-execa -D
pnpm i snowpack-plugin-execa -D
yarn add snowpack-plugin-execa -D
```

```javascript
// snowpack.config.js
/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  plugins: [
    [
      'snowpack-plugin-execa',
      {
        commands: [
          { command: 'prisma', args: ['-v'] },
          { command: 'node', args: ['-v'] },
        ],
      },
    ],
  ],
};
```

### Configuration

```typescript
export interface ExecaPluginOptions {
  // commands to execute
  commands?: CommandItem[];
  // options shared by all commands
  sharedOptions?: Options;
  // if child process throw errors, throw it.
  throwOnCommandFailed?: boolean;
}

// execa(command, args, options)
export interface CommandItem {
  command?: string;
  args?: string[];
  options?: Options;
}
```

## markdown-import

Snowpack plugin for markdown import

- [x] MarkDown to HTML(By [Marked](https://marked.js.org/)).
- [x] Sanitize(By [DOMPurify](https://github.com/cure53/DOMPurify))

```bash
npm i snowpack-plugin-markdown-import -D
pnpm i snowpack-plugin-markdown-import -D
yarn add snowpack-plugin-markdown-import -D
```

```javascript
// snowpack.config.js
/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  plugins: [['snowpack-plugin-markdown-import', {}]],
};
```

```typescript
declare module '*.md' {
  const result: {
    // raw .md file content
    raw: string;
    // parsed html
    html: string;
    // markdown file name (basename)
    fileName: string;
  };
  export default result;
}
```

In React:

```tsx
import React from 'react';
import MD from './hello.md';

function App() {
  return (
    <div>
      <h3>HTML</h3>
      <div dangerouslySetInnerHTML={{ __html: MD.html }}></div>
      <h3>Raw</h3>
      <div>{MD.raw}</div>
    </div>
  );
}

export default App;
```

### Configuration

This plugin use [marked](https://www.npmjs.com/package/marked) under the hood, so you can easily pass execa options to plugin.

```typescript
export interface MDPluginOptions {
  // options passed to marked
  // default: {}
  markedOptions?: MarkedOptions;
  // should sanitize parsed HTML
  // default: false
  sanitize?: boolean;
  // DOMPurify sanitize options
  // default: {}
  sanitizeOptions?: SanitizeConfig;
  // export .md file as .json
  // Note: Snowpack will generate .proxy.js for .json file
  // so this option will not affect code result.
  // default: false
  exportAsJSON?: boolean;
  // transform marked parsed result(html)
  transformParsedResult?: (result: string) => string;
  // tranform markdown file raw before marked parse(plain text)
  transformRawBeforeParse?: (raw: string) => string;
}
```

## serve

Snowpack plugin for static serve.

```bash
npm i serve snowpack-plugin-serve -D
pnpm i serve snowpack-plugin-serve -D
yarn add serve snowpack-plugin-serve -D
```

**Put this plugin at the last of plugin list to avoid blocking.**

```javascript
// snowpack.config.js
/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  plugins: [
    // ... other plugins
    // must be put at the last!
    [
      'snowpack-plugin-serve',
      {
        execaOptions: {},
        serveArgs: [],
      },
    ],
  ],
};
```

### Configuration

This plugin use [serve](https://www.npmjs.com/package/serve) and [execa](https://www.npmjs.com/package/execa) under the hood, so you can easily pass options to plugin.

```typescript
export interface ServePluginOptions {
  // default:
  // preferLocal: true
  // stdio: "inherit"
  execaOptions?: ExecaOptions;
  // default: "-s"
  // This option will be passed to serve command
  // e.g. ["--single","--listen 5050"] -> serve --single --listen 5050 {buildDir}
  // The last arg will always be buildDir
  serveArgs?: string[];
}
```
