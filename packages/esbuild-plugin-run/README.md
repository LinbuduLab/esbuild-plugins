# esbuild-plugin-run

ESBuild plugin to execute output file after build.

## Usage

**Node: this plugin require ESBuild version ^0.11.19 for the `onEnd` hooks**

**GitHub Repository/Homepage is private for now, if you got any troubles, just open issue in this [repo](https://github.com/linbudu599/Blog).**

**This plugin support only single-output(outfile) mode.**

```bash
npm i esbuild-plugin-run -D
pnpm i esbuild-plugin-run -D
yarn add esbuild-plugin-run -D
```

```typescript
import { build } from 'esbuild';
import run from 'esbuild-plugin-run';

(async () => {
  const res1 = await build({
    entryPoints: ['./demo.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [run()],
  });
})();
```

- use `execa.node` as default script executor.
- input `rs`/`restart` to restart process.
- input `cls`/`clean` to clear console.

## Configuration

This plugin use [execa](https://www.npmjs.com/package/execa) under the hood, so you can easily pass execa options to plugin.

```typescript
export interface RunOptions {
  // execa options
  // https://www.npmjs.com/package/execa
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
