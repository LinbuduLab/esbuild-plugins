# esbuild-plugin-node-externals

ESBuild plugin for node externals handing.

- [Author](https://github.com/linbudu599)
- [GitHub Repo](https://github.com/LinbuduLab/esbuild-plugins/tree/master/packages/esbuild-plugin-node-externals#readme)
- [Changelog](https://github.com/LinbuduLab/esbuild-plugins/blob/main/packages/esbuild-plugin-node-externals/CHANGELOG.md)

## Usage

```bash
npm install esbuild-plugin-node-externals --save-dev
pnpm install esbuild-plugin-node-externals --save-dev
yarn add esbuild-plugin-node-externals --save-dev
```

```typescript
import { build } from 'esbuild';
import { nodeExternals } from 'esbuild-plugin-node-externals';

(async () => {
  const res = await build({
    entryPoints: ['.src/main.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [
      nodeExternals({
        packagePaths: 'package.json',
        include: ['SOME_PKG_YOU_WANT_TO_INCLUDE_AT_BUNDLE'],
      }),
    ],
  });
})();
```

## Configurations

```typescript
export interface NodeExternalsOptions {
  /**
   * list of package.json paths to read from
   * if not specified, will read from cwd
   */
  packagePaths: string | string[];

  /**
   * mark all dependencies as external
   * @default true
   */
  withDeps: boolean;

  /**
   * mark all devDependencies as external
   * @default true
   */
  withDevDeps: boolean;

  /**
   * mark all peerDependencies as external
   * @default true
   */
  withPeerDeps: boolean;

  /**
   * mark all optionalDependencies as external
   * @default true
   */
  withOptDeps: boolean;

  /**
   * list of packages to exclude from externalization
   */
  include: string[];
}
```
