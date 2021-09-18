# esbuild-plugin-ignore

ESBuild plugin for require/import ignore.

For more information, see [Webpack IgnorePlugin](https://webpack.js.org/plugins/ignore-plugin/).

## Usage

**GitHub Repository/Homepage is private for now, if you got any troubles, just open issue in this [repo](https://github.com/linbudu599/Blog).**

```bash
npm i esbuild-plugin-ignore-module -D
pnpm i esbuild-plugin-ignore-module -D
yarn add esbuild-plugin-ignore-module -D
```

```typescript
import { build } from 'esbuild';
import ignore from 'esbuild-plugin-ignore-module';

(async () => {
  const res1 = await build({
    entryPoints: ['./demo.ts'],
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

  Only the first resolved(start from entry) module will be ignored, in the example above, only `chalk` in shared.ts will be ignored. If `contextRegExp` is not passed, all `chalk` imports will be ignored.

  This is because same `resourceRegExp` will be put in same ESBuild [filter](https://esbuild.github.io/plugins/#filters) handler.

- Remember to add file extensions in RegExp, because ESBuild plugin [importer](https://esbuild.github.io/plugins/#resolve-arguments) is an absolute path.

## Configuration

```typescript
export interface IgnorePattern {
  // import/require statement to ignore
  resourceRegExp: RegExp;
  // importer of resourceRegExp to ignore
  // example:
  // resourceRegExp: /chalk$/ & contextRegExp: /ora
  // this will ignore chalk import in ora
  // resourceRegExp: /^\.\/locale$/ & contextRegExp: /moment$/
  // this will ignore any './locale' imports in moment
  contextRegExp?: RegExp;
}

export interface ESBuildPluginIgnoreOption {
  ignore?: IgnorePattern | IgnorePattern[];
  // verbose logging when module ignored.
  verbose?: boolean;
}
```
