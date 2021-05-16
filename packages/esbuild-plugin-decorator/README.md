# esbuild-plugin-decorator

ESBuild plugin to handle TypeScript decorators compilation.

- Support compilation by `typescript` / `@swc/core`.
- Support typescript/swc config file load.
- (WIP)Integration with [Nx](https://nx.dev/).

## Usage

```bash
# install peer dependencies
# install @swc/core if you want to use swc as compiler
npm i esbuild typescript @swc/core -D
```

```bash
npm i esbuild-plugin-decorator -D
pnpm i esbuild-plugin-decorator -D
yarn add esbuild-plugin-decorator -D
```

```typescript
import { build } from 'esbuild';
import { esbuildPluginDecorator } from 'esbuild-plugin-decorator';


(async () => {
  const res1 = await build({
    entryPoints: ['./demo.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [
      esbuildPluginDecorator({
        tsconfigPath: 'apps/nest-app/tsconfig.app.json',
      }),
    ],
  });
})();
```

## Configuration

```typescript
export interface ESBuildPluginDecoratorOptions {
  // tsconfig path (tsconfig.json)
  // required even you're using swc as compiler
  // if not specified, will search tsconfig.json(relative to cwd option) by default
  tsconfigPath?: string;
  // swc config path (.swcrc)
  swcrcPath?: string;

  // force specified compiler for all code compilation
  // (even no decorators are found)
  // if set to false, plugin will be skipped when no decorators are found
  force?: boolean;

  // default: process.cwd() 
  cwd?: string;

  // use typescript or @swc/core for decorator compilation
  // default: tsc
  compiler?: 'tsc' | 'swc';

  // when innx project, will search tsconfig.base.json
  // when tsconfigPath is not speficied
  // there will be more customization for nx-workspace in the future
  // default: false
  isNxProject?: boolean;

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
