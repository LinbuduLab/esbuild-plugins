# esbuild-plugin-clean

ESBuild plugin for cleaning up output/assets before building.

# esbuild-plugin-clean

ESBuild plugin for cleaning up output/assets before building.

## Usage

**Node: this plugin require ESBuild version ^0.11.19 for the `onStart`/`onEnd` hooks**

**GitHub Repository/Homepage is private for now, if you got any troubles, just open issue in this [repo](https://github.com/linbudu599/Blog).**

```bash
npm i esbuild-plugin-clean -D
pnpm i esbuild-plugin-clean -D
yarn add esbuild-plugin-clean -D
```

```typescript
import { build } from 'esbuild';
import clean from 'esbuild-plugin-clean';

(async () => {
  const res1 = await build({
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

## Configuration

This plugin use [del](https://www.npmjs.com/package/del) under the hood, so you can easily pass del options to plugin.

```typescript
export interface CleanOptions {
  // del patterns
  // default: []
  patterns?: string | string[];
  // use dry-run mode to have a try
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
