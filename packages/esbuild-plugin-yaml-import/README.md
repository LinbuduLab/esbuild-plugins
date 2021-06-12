# esbuild-plugin-yaml-import

ESBuild plugin for yaml import, by [JS-YAML](https://github.com/nodeca/js-yaml).

## Usage

**GitHub Repository/Homepage is private for now, if you got any troubles, just open issue in this [repo](https://github.com/linbudu599/Blog).**

```bash
npm i esbuild-plugin-yaml-import -D
pnpm i esbuild-plugin-yaml-import -D
yarn add esbuild-plugin-yaml-import -D
```

```typescript
import { build } from 'esbuild';
import yaml from 'esbuild-plugin-yaml-import';

(async () => {
  const res1 = await build({
    entryPoints: ['./demo.tsx'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [yaml()],
  });
})();
```

Yaml content will be parsed as JSON, and processed by ESBuild json loader.

## Configuration

See [JS-YAML documents](https://github.com/nodeca/js-yaml#load-string---options-) for details.

```typescript
export interface Options {
  // JS-YAML load options
  jsyamlLoadOptions?: JSYamlOptions;

  // transform YAML content after read file
  transformContent?: (content: string) => string;

  // transform parsed content after load
  transformParsed?: (
    data: string | number | object,
    filePath: string
  ) => object | undefined;
}
```
