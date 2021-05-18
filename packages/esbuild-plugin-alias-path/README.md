# esbuild-plugin-alias-path

ESBuild plugin for alias / tsconfig-paths.

## Usage

**Node: this plugin require ESBuild version ^0.11.19 for the `onStart`/`onEnd` hooks**

**GitHub Repository/Homepage is private for now, if you got any troubles, just open issue in this [repo](https://github.com/linbudu599/Blog).**

```bash
npm i esbuild-plugin-alias-path -D

pnpm i esbuild-plugin-alias-path -D

yarn add esbuild-plugin-alias-path -D
```

```typescript
import { esbuildPluginAliasPath } from 'esbuild-plugin-alias-path';

(async () => {
  const res = await build({
    entryPoints: ['apps/nest-app/src/main.ts'],
    bundle: true,
    tsconfig: './tsconfig.base.json',
    outfile: './dist/main.js',
    plugins: [
      esbuildPluginAliasPath({
        // absolute path is required
        // for node package resolve, use require.resolve("package-name")
        alias: { '@/foo': 'D://schematics/apps/nest-app/src/alias/foo.ts' },
        tsconfigPath: 'apps/nest-app/tsconfig.app.json',
      }),
    ],
    platform: 'node',
    format: 'cjs',
    external: ['@nestjs/core', '@nestjs/common'],
  });
})();
```

## Configuration

```typescript
export interface Options {
  // alias, default as {}
  // {"replace-key": "replace-with"}
  // you will need to use absolute path as replace-with
  alias?: Record<string, string>;
  // tsconfig.json path
  tsconfigPath?: string;
  // should this plugin be skipped
  skip?: boolean;
}
```
