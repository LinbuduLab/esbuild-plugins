# esbuild-plugin-copy

ESBuild plugin for assets copy.

## Usage

**Node: this plugin require ESBuild version ^0.11.19 for the `onStart`/`onEnd` hooks**

**GitHub Repository/Homepage is private for now, if you got any troubles, just open issue in this [repo](https://github.com/linbudu599/Blog).**

```bash
npm i esbuild-plugin-copy -D
pnpm i esbuild-plugin-copy -D
yarn add esbuild-plugin-copy -D
```

```typescript
import { build } from 'esbuild';
import copy from 'esbuild-plugin-copy';

(async () => {
  const res1 = await build({
    entryPoints: ['./demo.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [
      copy({
        assets: {
          from: ['./assets/*'],
          to: ['./assets', './tmp-assets'],
        },
      }),
    ],
  });
})();
```

## Configuration

```typescript
type MaybeArray<T> = T | T[];

// file/folder/globs
export interface AssetPair {
  from: MaybeArray<string>;
  to: MaybeArray<string>;
}

export interface Options {
  // assets pair to copy
  assets: MaybeArray<AssetPair>;
  // start copy on onStart/onEnd hooks
  // default: false
  copyOnStart: boolean;
  // verbose logging
  // default: true
  verbose: boolean;
  // extra globby options to match paths to copy from
  globbyOptions: GlobbyOptions;
}
```
