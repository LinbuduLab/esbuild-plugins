# ESBuild

## Note

**Note: All plugins require ESBuild version ^0.14.0 as peerDependencies.**

## alias path

ESBuild plugin for alias replacement.

```bash
npm install esbuild-plugin-alias-path --save-dev
yarn add esbuild-plugin-alias-path --save-dev
pnpm install esbuild-plugin-alias-path --save-dev
```

```typescript
import { build } from 'esbuild';
import { esbuildPluginAliasPath } from 'esbuild-plugin-alias-path';

(async () => {
  const res = await build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [
      esbuildPluginAliasPath({
        alias: { '@foo': './src/alias/foo.ts' },
      }),
    ],
  });
})();

// src/main.ts
import { FOO } from '@foo';
console.log(FOO);

// src/alias/foo.ts
export const FOO = 'foo';
```

### Configuration

```typescript
export interface Options {
  // alias pairs, default: {}
  // {"replace-key": "replace-with"}
  // if value of k-v pair is absolute path, it will be used directly or the path will be resolved with cwd
  alias?: Record<string, string>;
  // should this plugin be skipped
  skip?: boolean;
  // default: process.cwd()
  cwd?: string;
}
```

You can also use syntax `*` like `@alias/*`:

```typescript
esbuildPluginAliasPath({
  alias: {
    '@alias/*': path.resolve(__dirname, './src/alias'),
  },
});
```

**NOTE: Only files under the `alias` dir will be resolved, the nested file will be ignored instead.**

**NOTE: In TypeScript project, `compilerOptions.paths` in `tsconfig.json` will be used by ESBuild automatically, so you will need this plugin only when you're going to replace the alias dynamically.**

## clean

ESBuild plugin for cleaning up output/assets before building.

```bash
npm install esbuild-plugin-clean --save-dev
pnpm install esbuild-plugin-clean --save-dev
yarn add esbuild-plugin-clean --save-dev
```

```typescript
import { build } from 'esbuild';
import { clean } from 'esbuild-plugin-clean';

(async () => {
  const res = await build({
    entryPoints: ['./demo.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [
      clean({
        patterns: ['./dist/*'],
      }),
    ],
  });
})();
```

### Configuration

This plugin use [del](https://www.npmjs.com/package/del) under the hood, so you can easily pass `del options` to this plugin.

```typescript
export interface CleanOptions {
  // del patterns
  // default: []
  patterns?: string | string[];
  // use dry-run mode to see what's going to happen
  // default: false
  dryRun?: boolean;
  // del options
  // default: {}
  options?: DelOptions;
  // use del or del.sync for cleaning up
  // default: true
  sync?: boolean;
  // do cleaning in start/end/both
  // maybe in some strange cases you will need it ? :)
  // default: "start"
  cleanOn?: 'start' | 'end' | 'both';
}
```

## compress

ESBuild plugin for output compression (`gzip`/`brotli`).

```bash
npm install esbuild-plugin-compress --save-dev
pnpm install esbuild-plugin-compress --save-dev
yarn add esbuild-plugin-compress --save-dev
```

```typescript
import { build } from 'esbuild';
import { compress } from 'esbuild-plugin-compress';

(async () => {
  const res = await build({
    entryPoints: ['./demo.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [
      compress({
        outputDir: 'compressed-dist',
      }),
    ],
  });
})();
```

### Configuration

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
  // should remove origin files
  // if no compression is specified, origin files will must be generated
  // default: false
  removeOrigin?: boolean;
  // output dir name, relative to outdir/outfile(path.dirname(outfile))
  // default: null, will generate compressed file at the same level of output file
  outputDir?: string;
}
```

## copy

ESBuild plugin for assets copy handle.

Since version `1.0.1`, option `keepStructure` is supported to control behavior of copying nested files(in both `Option` level and `AssetPair` level).

Since version `1.1.0`, option `resolveFrom` is supported to control base path which is used to caclute the destination of copied file.

```bash
npm install esbuild-plugin-copy --save-dev
pnpm install esbuild-plugin-copy --save-dev
yarn add esbuild-plugin-copy --save-dev
```

```typescript
import { build } from 'esbuild';
import { copy } from 'esbuild-plugin-copy';

(async () => {
  const res = await build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [
      copy({
        // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
        // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
        resolveFrom: 'cwd',
        assets: {
          from: ['./assets/*'],
          to: ['./assets', './tmp-assets'],
        },
      }),
    ],
  });
})();
```

### Preserve file structure

```typescript
import { copy } from 'esbuild-plugin-copy';
import { build } from 'esbuild';

(async () => {
  const res = await build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    outfile: './dist/main.js',
    watch: true,
    plugins: [
      copy({
        // Not Recommended!
        // keepStructure: true,
        assets: [
          {
            from: ['./node_modules/tinymce/skins/**/*'],
            to: ['./preserved-structure/skins'],
            keepStructure: true,
          },
        ],
      }),
    ],
  });
})();
```

- When you set root option `keepStructure: true`, it means keep structure for all asset pairs, but if some of your asset pairs use `./path/*` which ends with `/*`, default `globby` will not expand sub-dircetories like `./path/foo`. **So it's not recommended to use this in root-level.**

- When you set `AssetPair.keepStructure`, it means keep structure for current assets pair.
- The final performance of the above configuration is as follows:

  ```text
  |-node_modules/tinymce/skins
  |--- content
  |----- dark
  |----- default
  |----- document
  |--- ui
  |----- oxide
  |----- oxide-dark
  ```

  ```text
  |- dist/preserved-structure/skins
  |--- content
  |----- dark
  |----- default
  |----- document
  |--- ui
  |----- oxide
  |----- oxide-dark
  ```

You can also use patterns with extension names like `./path/**/*.js`

### Configuration

```typescript
type MaybeArray<T> = T | T[];

export interface AssetPair {
  /**
   * from path is resolved based on `cwd`
   */
  from: MaybeArray<string>;
  /**
   * to path is resolved based on `outdir` or `outfile` in your ESBuild options
   */
  to: MaybeArray<string>;
  /**
   * use Keep-Structure mode for current assets pair
   * @default false
   */
  keepStructure?: boolean;
}

export interface Options {
  /**
   * assets pair to copy
   * @default []
   */
  assets: MaybeArray<AssetPair>;
  /**
   * execute copy in `ESBuild.onEnd` hook(recommended)
   *
   * set to true if you want to execute in onStart hook
   * @default false
   */
  copyOnStart: boolean;
  /**
   * enable verbose logging
   *
   * we set this option to be true by default because it outputs
   * from-path and to-path finally passed to `fs.copyFileSync`
   * @default true
   */
  verbose: boolean;
  /**
   * options passed to `globby` when we 're globbing for files to copy
   * @default {}
   */
  globbyOptions: GlobbyOptions;
  /**
   * only execute copy operation once
   *
   * useful when you're using ESBuild.build watching mode
   * @default false
   */
  once: boolean;
  /**
   * use `Keep-Structure` mode for all assets pairs
   *
   * NOTE: this option takes higher priority than `assets.keepStructure` option
   * @default false
   */
  keepStructure: boolean;

  /**
   * base path used to resolve relative `assets.to` path
   * by default this plugin use `outdir` or `outfile` in your ESBuild options
   * you can specify "cwd" or process.cwd() to resolve from current working directory,
   * also, you can specify somewhere else to resolve from.
   *
   * @default "out"
   */
  resolveFrom: 'cwd' | 'out' | string;
}
```

## decorator

ESBuild plugin to handle TypeScript decorators compilation.

- Support compilation by `tsc` / `@swc/core`.
- Support typescript/swc config file load.

```bash
# install peer dependencies
# install @swc/core if you want to use swc as compiler
npm install typescript @swc/core --save-dev
```

```bash
npm install esbuild-plugin-decorator --save-dev
pnpm install esbuild-plugin-decorator --save-dev
yarn add esbuild-plugin-decorator --save-dev
```

```typescript
import { build } from 'esbuild';
import { esbuildPluginDecorator } from 'esbuild-plugin-decorator';

(async () => {
  const res = await build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [
      esbuildPluginDecorator({
        tsconfigPath: 'tsconfig.json',
      }),
    ],
  });
})();
```

### Configuration

```typescript
export interface ESBuildPluginDecoratorOptions {
  // tsconfig.json path
  // required even you're using swc as compiler
  // if not specified, will search tsconfig.json(relative to cwd option) by default
  tsconfigPath?: string;

  // swc config path (.swcrc)
  swcrcPath?: string;

  // force specified compiler for all source code compilation
  // (even no decorators are found)
  // if set to false, plugin will be skipped when no decorators are found
  force?: boolean;

  // default: process.cwd()
  cwd?: string;

  // use typescript or @swc/core for decorator compilation
  // default: tsc
  compiler?: 'tsc' | 'swc';

  // extra compile options
  // will override config from config file
  tscCompilerOptions?: TSCCompileOptions;

  swcCompilerOptions?: SWCCompileOptions;

  // verbose logging
  // log info about plugin skipped / decorators not found / current configuration
  // default: false
  verbose?: boolean;
}
```

## filesize

ESBuild plugin for displaying output file size info.

```bash
npm install esbuild-plugin-filesize --save-dev
pnpm install esbuild-plugin-filesize --save-dev
yarn add esbuild-plugin-filesize --save-dev
```

```typescript
import { build } from 'esbuild';
import { esbuildPluginFileSize } from 'esbuild-plugin-filesize';

(async () => {
  const res = await build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [esbuildPluginFileSize()],
  });
})();
```

### Configuration

This plugin use [filesize](https://www.npmjs.com/package/filesize) for file size formatting under the hood, so you can easily pass execa options to plugin.

```typescript
export interface ESBuildPluginFileSizeOption {
  // show terser minified size
  showMinifiedSize?: boolean;
  // show gzipped size
  showGzippedSize?: boolean;
  // show brotli size
  showBrotliSize?: boolean;
  // show plugin title
  showPluginTitle?: boolean;

  // filesize format option
  // https://www.npmjs.com/package/filesize
  format?: FileSizeFormatOption;
  // display theme
  theme?: 'light' | 'dark';
}
```

## ignore

ESBuild plugin for require/import ignore.

For more information, see [Webpack IgnorePlugin](https://webpack.js.org/plugins/ignore-plugin/).

```bash
npm install esbuild-plugin-ignore-module --save-dev
pnpm install esbuild-plugin-ignore-module --save-dev
yarn add esbuild-plugin-ignore-module --save-dev
```

```typescript
import { build } from 'esbuild';
import { ignore } from 'esbuild-plugin-ignore-module';

(async () => {
  const res = await build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [
      ignore({
        ignore: [
          // ignore module 'chalk' import in shared.ts files
          // file extension is required in RegExp
          {
            resourceRegExp: /chalk$/,
            contextRegExp: /shared.ts$/,
          },
          // ignore module 'readline' from all import statement
          {
            resourceRegExp: /readline$/,
          },
        ],
      }),
    ],
  });
})();

// demo.ts
import { SHARED } from './shared';

console.log(SHARED);

// shared.ts
import chalk from 'chalk';
import ora from 'ora';

ora().start();
export const SHARED = 'SHARED';
```

**NOTE:**

- When there're pairs with same `resourceRegExp`, like:

  ```typescript
  ignore: [
    {
      resourceRegExp: /chalk$/,
      contextRegExp: /shared.ts$/,
    },
    {
      resourceRegExp: /chalk$/,
      contextRegExp: /ora/,
    },
  ],
  ```

  Only the first resolved(start from entry) module will be ignored, in the example above, only `chalk` in shared.ts will be ignored. If `contextRegExp` is not passed, `chalk` imports in all files will be ignored.

  The reason is that exactly equal `resourceRegExp` will be processed by shared ESBuild [filter](https://esbuild.github.io/plugins/#filters) handler.

- Remember to add file extensions in RegExp, because ESBuild plugin [importer](https://esbuild.github.io/plugins/#resolve-arguments) is an absolute full path.

### Configuration

```typescript
export interface IgnorePattern {
  // import/require statement to ignore
  resourceRegExp: RegExp;
  // importer of resourceRegExp to ignore
  // example:
  // resourceRegExp: /chalk$/ & contextRegExp: /ora
  // this will ignore chalk import in ora internal files
  // resourceRegExp: /^\.\/locale$/ & contextRegExp: /moment$/
  // this will ignore any './locale' imports in moment internal files
  contextRegExp?: RegExp;
}

export interface ESBuildPluginIgnoreOption {
  // ignore patterns
  ignore?: IgnorePattern | IgnorePattern[];
  // verbose logging when module ignored.
  verbose?: boolean;
}
```

## markdown-import

ESBuild plugin for markdown import(`.md` files).

```bash
npm install esbuild-plugin-markdown-import --save-dev
pnpm install esbuild-plugin-markdown-import --save-dev
yarn add esbuild-plugin-markdown-import --save-dev
```

```typescript
import { build } from 'esbuild';
import { markdown } from 'esbuild-plugin-markdown-import';

(async () => {
  const res = await build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [markdown()],
  });
})();

// dmeo.ts
import md from 'hello.md';

console.log(md);

// typing.d.ts
declare module '*.md' {
  // parsed html
  export const html: string;
  // raw .md file content
  export const raw: string;
  // markdown file name (basename)
  export const filename: string;
}

// or
declare module '*.md' {
  const result: {
    raw: string;
    html: string;
    fileName: string;
  };
  export default result;
}
```

MarkDown content will be parsed to JSON and use ESBuild JSON loader:

```json
{
  "html": "<h1 id='hello'>Hello</h1>\n",
  "raw": "# Hello\r\n",
  "filename": "hello.md"
}
```

### Configuration

This plugin use [marked](https://www.npmjs.com/package/marked) under the hood, so you can easily pass execa options to plugin.

```typescript
export interface Options {
  // marked options, will be passed to marked parser
  // default: {}
  markedOptions?: MarkedOptions;
  // use sync/async parser
  // default: true
  sync?: boolean;
  // extra k-v pairs to push to generated json
  // default: {}
  extraJSONReturn?: Record<string, unknown>;
  // transform marked parsed result(html)
  transformParsedResult?: (result: string) => string;
  // tranform markdown file raw before marked parse(plain text)
  transformRawBeforeParse?: (raw: string) => string;
  // tranform markdown file raw after marked parse(plain text)
  transformRawAfterParse?: (raw: string) => string;
}
```

## node-externals

ESBuild plugin for node externals handle.

```bash
npm install esbuild-plugin-node-externals --save-dev
pnpm install esbuild-plugin-node-externals --save-dev
yarn add esbuild-plugin-node-externals --save-dev
```

```typescript
import { build } from 'esbuild';
import { esbuildPluginNodeExternals } from 'esbuild-plugin-node-externals';

(async () => {
  const res = await build({
    entryPoints: ['.src/main.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [
      esbuildPluginNodeExternals({
        packagePaths: 'package.json',
        include: ['SOME_PKG_YOU_WANT_TO_INCLUDE_AT_BUNDLE'],
      }),
    ],
  });
})();
```

### Configuration

```typescript
export interface Options {
  // you package.json path(s)
  // will search for 'package.json' in same level with .git
  packagePaths?: string | string[];
  // should regard dependencies as externals
  // default: true
  withDeps?: boolean;
  // should regard devDependencies as externals
  // default: true
  withDevDeps?: boolean;
  // should regard peerDependencies as externals
  // default: true
  withPeerDeps?: boolean;
  // should regard optionalDependencies as externals
  // default: true
  withOptDeps?: boolean;
  // deps you want to include at bundle
  include?: string[];
}
```

## run

ESBuild plugin that execute output file after build completed.

**Note: this plugin require ESBuild version ^0.11.19 for the `onEnd` hooks.**

**This plugin support only single-output(outfile) mode.**

```bash
npm install esbuild-plugin-run --save-dev
pnpm install esbuild-plugin-run --save-dev
yarn add esbuild-plugin-run --save-dev
```

```typescript
import { build } from 'esbuild';
import { run } from 'esbuild-plugin-run';

(async () => {
  const res = await build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [run()],
  });
})();
```

- use `execa.node` as default script executor.
- input `rs`/`restart` to restart process.
- input `cls`/`clean` to clear console.

### Configuration

This plugin use [execa](https://www.npmjs.com/package/execa) under the hood, so you can easily pass execa options to plugin.

```typescript
export interface RunOptions {
  // execa options
  execaOptions?: Options;
  // use customRunner based on execa
  customRunner?: (filePath: string) => ChildProcess | ExecaChildProcess<string> | any;
}

// use customRunner
run({
  customRunner: (filePath) =>
    execa.node(filePath, {
      stdio: 'inherit',
    }),
}),
```
