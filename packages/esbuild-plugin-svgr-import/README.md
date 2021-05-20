# esbuild-plugin-svgr-import

ESBuild plugin to import svg as React Components, by [@svgr/core](https://github.com/gregberge/svgr)

## Usage

**GitHub Repository/Homepage is private for now, if you got any troubles, just open issue in this [repo](https://github.com/linbudu599/Blog).**

```bash
npm i esbuild-plugin-svgr-import @svgr/core -D
pnpm i esbuild-plugin-svgr-import @svgr/core -D
yarn add esbuild-plugin-svgr-import @svgr/core -D
```

```typescript
import { build } from 'esbuild';
import svrg from 'esbuild-plugin-svgr-import';

(async () => {
  const res1 = await build({
    entryPoints: ['./demo.tsx'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [svrg()],
  });
})();
```

## Configuration

See [svgr documents](https://react-svgr.com/) for details.


```typescript
export interface Options {
  svgrConfig?: {
    configFile?: string;
    ext?: string;
    icon?: boolean;
    native?:
      | boolean
      | {
          expo: true;
        };
    typescript?: boolean;
    dimensions?: boolean;
    expandProps?: string;
    prettier?: boolean;
    svgo?: boolean;
    svgoConfig?: object;
    ref?: boolean;
    memo?: boolean;
    replaceAttrValues?: Record<string, string>[];
    svgProps?: Record<string, unknown>;
    titleProp?: boolean;
    template?: (...args: unknown[]) => unknown;
    outDir?: string;
    indexTemplate?: any;
    ignoreExisting?: boolean;
    filenameCase?: string;
  };
}
```
