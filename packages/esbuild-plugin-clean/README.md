# esbuild-plugin-clean

ESBuild plugin for cleaning up output/assets before building.

- [Author](https://github.com/linbudu599)
- [GitHub Repo](https://github.com/LinbuduLab/esbuild-plugins/tree/master/packages/esbuild-plugin-clean#readme)
- [Changelog](https://github.com/LinbuduLab/esbuild-plugins/blob/main/packages/esbuild-plugin-clean/CHANGELOG.md)

## Usage

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
        patterns: ['./dist/*', './dist/assets/*.map.js'],
        cleanOnStartPatterns: ['./prepare'],
        cleanOnEndPatterns: ['./post'],
      }),
    ],
  });
})();
```

## Configurations

This plugin use [del](https://www.npmjs.com/package/del) under the hood, so you can easily pass `del options` to this plugin.

```typescript
export interface CleanOptions {
  /**
   * file clean patterns (passed to `del`)
   *
   * @default: []
   */
  patterns?: string | string[];

  /**
   * file clean patterns(in onStart only) (passed to `del`)
   *
   * @default: []
   */
  cleanOnStartPatterns?: string | string[];

  /**
   * file clean patterns(in onEnd only) (passed to `del`)
   *
   * @default: []
   */
  cleanOnEndPatterns?: string | string[];

  /**
   * use dry-run mode to see what's going to happen
   *
   * this option will enable verbose option automatically
   *
   * @default: false
   */
  dryRun?: boolean;

  /**
   * extra options passed to `del`
   *
   * @default {}
   */
  options?: DelOptions;

  /**
   * execute clean sync or async (use `del` or `del.sync` for cleaning up)
   *
   * @default: true
   */
  sync?: boolean;

  /**
   * do cleaning in start / end / both
   * maybe in some strange cases you will need it ? :P
   *
   * @default: "start"
   */
  cleanOn?: 'start' | 'end' | 'both';

  /**
   * enable verbose logging to see what's happening
   *
   * @default false
   */
  verbose?: boolean;
}
```
