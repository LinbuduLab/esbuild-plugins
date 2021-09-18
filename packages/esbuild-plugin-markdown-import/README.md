# esbuild-plugin-markdown-import

ESBuild plugin for markdown import.

## Usage

**GitHub Repository/Homepage is private for now, if you got any troubles, just open issue in this [repo](https://github.com/linbudu599/Blog).**

```bash
npm i esbuild-plugin-markdown-import -D
pnpm i esbuild-plugin-markdown-import -D
yarn add esbuild-plugin-markdown-import -D
```

```typescript
import { build } from 'esbuild';
import markdown from 'esbuild-plugin-markdown-import';

(async () => {
  const res1 = await build({
    entryPoints: ['./demo.ts'],
    bundle: true,
    outfile: './dist/main.js',
    plugins: [markdown()],
  });
})();

// dmeo.ts
import md from 'hello.md';

console.log(md);

// typing.d.ts
declare module '*.md';
```

MarkDown content will be parsed to JSON and use ESBuild JSON loader:

```json
{
  "html": "<h1 id='hello'>Hello</h1>\n",
  "raw": "# Hello\r\n",
  "filename": "hello.md"
}
```

## Configuration

```typescript
export interface Options {
  // marked options, will be passed to marked parser
  // default: {}
  markedOptions?: MarkedOptions;
  // use sync/async parser
  // default: true
  sync?: boolean;
  // extra k-v pairs to push to generated json
  // default: {}
  extraJSONReturn?: Record<string, unknown>;
  // transform marked parsed result(html)
  transformParsedResult?: (result: string) => string;
  // tranform markdown file raw before marked parse(plain text)
  transformRawBeforeParse?: (raw: string) => string;
  // tranform markdown file raw after marked parse(plain text)
  transformRawAfterParse?: (raw: string) => string;
}
```
