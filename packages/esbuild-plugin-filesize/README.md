# esbuild-plugin-filesize

ESBuild plugin for displaying output file size info.

Single output(specify `outfile`):

![image-20210516103918202](https://budu-oss-store.oss-cn-shenzhen.aliyuncs.com/image-20210516103918202.png)

Multiple outputs(specify `outdir`):

![image-20210516104231818](https://budu-oss-store.oss-cn-shenzhen.aliyuncs.com/image-20210516104231818.png)

## Usage

**Node: this plugin require ESBuild version ^0.11.19 for the `onStart`/`onEnd` hooks**

**GitHub Repository/Homepage is private for now, if you got any troubles, just open issue in this [repo](https://github.com/linbudu599/Blog).**

```bash
npm i esbuild-plugin-filesize -D
pnpm i esbuild-plugin-filesize -D
yarn add esbuild-plugin-filesize -D
```


```typescript
import { build } from 'esbuild';
import { esbuildPluginFileSize } from 'esbuild-plugin-filesize';

(async () => {
  const res1 = await build({
    entryPoints: ['./demo.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [
      esbuildPluginFileSize()
    ],
  });
})();
```

## Configuration

```typescript
export interface ESBuildPluginFileSizeOption {
  // show terser minified size
  showMinifiedSize?: boolean;
  // show gzipped size
  showGzippedSize?: boolean;
  // show brotli size
  showBrotliSize?: boolean;
  // show plugin title
  showPluginTitle?: boolean;

  // filesize format option
  // https://www.npmjs.com/package/filesize
  format?: FileSizeFormatOption;
  // display theme
  theme?: 'light' | 'dark';
}
```
