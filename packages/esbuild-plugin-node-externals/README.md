# esbuild-plugin-node-externals

ESBuild plugin for node externals handing.

## Usage

**GitHub Repository/Homepage is private for now, if you got any troubles, just open issue in this [repo](https://github.com/linbudu599/Blog).**

```bash
npm i esbuild-plugin-node-externals -D
pnpm i esbuild-plugin-node-externals -D
yarn add esbuild-plugin-node-externals -D
```

```typescript
import { build } from 'esbuild';
import { esbuildPluginNodeExternals } from 'esbuild-plugin-node-externals';

(async () => {
  const res1 = await build({
    entryPoints: ['apps/nest-app/index.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [
      esbuildPluginNodeExternals({
        packagePaths: 'apps/nest-app/package.json',
        include: ['SOME_PKG_YOU_WANT_TO_INCLUDE_AT_BUNDLE'],
      }),
    ],
  });
})();
```

## Configuration

```typescript
export interface Options {
  // you package.json path(s)
  // will search for 'package.json' in same level with .git
  packagePaths?: string | string[];
  // should regard dependencies as externals
  withDeps?: boolean;
  // should regard devDependencies as externals
  withDevDeps?: boolean;
  // should regard peerDependencies as externals
  withPeerDeps?: boolean;
  // should regard optionalDependencies as externals
  withOptDeps?: boolean;
  // deps you want to include at bundle
  include?: string[];
}
```
