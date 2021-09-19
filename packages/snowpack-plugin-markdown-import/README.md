# snowpack-plugin-markdown-import

Snowpack plugin for markdown import

## Progress

- [x] MarkDown to HTML(By [Marked](https://marked.js.org/)).
- [x] Sanitize(By [DOMPurify](https://github.com/cure53/DOMPurify))

## Usage

**GitHub Repository/Homepage is private for now, if you got any troubles, just open issue in this [repo](https://github.com/linbudu599/Blog).**

```bash
npm i snowpack-plugin-markdown-import -D
pnpm i snowpack-plugin-markdown-import -D
yarn add snowpack-plugin-markdown-import -D
```

```javascript
/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  plugins: [['snowpack-plugin-markdown-import', {}]],
};
```

```typescript
declare module '*.md' {
  const result: {
    // raw .md file content
    raw: string;
    // parsed html
    html: string;
    // markdown file name (basename)
    fileName: string;
  };
  export default result;
}
```

In React:

```tsx
import React from 'react';
import MD from './hello.md';

function App() {
  return (
    <div>
      <h3>HTML</h3>
      <div dangerouslySetInnerHTML={{ __html: MD.html }}></div>
      <h3>Raw</h3>
      <div>{MD.raw}</div>
    </div>
  );
}

export default App;
```

## Configuration

```typescript
export interface MDPluginOptions {
  // options passed to marked
  // default: {}
  markedOptions?: MarkedOptions;
  // should sanitize parsed HTML
  // default: false
  sanitize?: boolean;
  // DOMPurify sanitize options
  // default: {}
  sanitizeOptions?: SanitizeConfig;
  // export .md file as .json
  // Note: Snowpack will generate .proxy.js for .json file
  // so this option will not affect code result.
  // default: false
  exportAsJSON?: boolean;
  // transform marked parsed result(html)
  transformParsedResult?: (result: string) => string;
  // tranform markdown file raw before marked parse(plain text)
  transformRawBeforeParse?: (raw: string) => string;
}
```
