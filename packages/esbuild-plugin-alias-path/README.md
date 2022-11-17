# esbuild-plugin-alias-path

ESBuild plugin for alias path replacement.

- [Author](https://github.com/linbudu599)
- [GitHub Repo](https://github.com/LinbuduLab/esbuild-plugins/tree/master/packages/esbuild-plugin-alias-path#readme)
- [Changelog](https://github.com/LinbuduLab/esbuild-plugins/blob/main/packages/esbuild-plugin-alias-path/CHANGELOG.md)

## Usage

```bash
npm install esbuild-plugin-alias-path --save-dev
pnpm install esbuild-plugin-alias-path --save-dev
yarn add esbuild-plugin-alias-path --save-dev
```

```typescript
import { build } from 'esbuild';
import { aliasPath } from 'esbuild-plugin-alias-path';

(async () => {
  const res = await build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [
      aliasPath({
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

// Output dist/main.js
import { FOO } from './src/alias/foo.ts';
```

## Configurations

You can also use syntax `*` like `@alias/*`, this will explore all the files in the directory and replace the path.

> Use `@alias/*` instead of `@alias/**/*`

```typescript
aliasPath({
  alias: {
    '@alias/*': path.resolve(__dirname, './src/alias'),
  },
});
```

For example:

```text
|- alias
|- |- foo.ts
|-- nested
|-- |- bar.ts
```

Will be replaced to:

```text
@alias/foo.ts -> ./src/alias/foo.ts
@alias/nested/bar.ts -> ./src/alias/nested/bar.ts

```

**NOTE: In TypeScript project, `compilerOptions.paths` in `tsconfig.json` will be used by ESBuild automatically, so you will need this plugin only when you're going to replace the alias dynamically.**
