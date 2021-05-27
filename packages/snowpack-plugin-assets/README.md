# snowpack-plugin-assets

Snowpack plugin for assets copy.

## Progress

- [x] Common copy files.
- [ ] Re-Copy assets when assets changed.
- [ ] Copy assets when `watch` option enabled.

## Usage

**GitHub Repository/Homepage is private for now, if you got any troubles, just open issue in this [repo](https://github.com/linbudu599/Blog).**

```bash
npm i snowpack-plugin-assets -D
pnpm i snowpack-plugin-assets -D
yarn add snowpack-plugin-assets -D
```

Example:

```text
assets:
  - x
    - x.txt
    - x-foo
      x-foo.txt
  - y
    - y.txt
    - y-bar
      y-bar.txt
```


```javascript
/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  plugins: [
    [
      'snowpack-plugin-assets',
      {
        assets: {
          from: ['assets/**', '!assets/x'],
          to: 'assets',
        },
      },
    ],
  ]
};
```

## Configuration

```typescript
type MaybeArray<T> = T | T[];

export interface AssetPair {
  // file/folder/globs
  from: MaybeArray<string>;
  to: MaybeArray<string>;
}

export interface AssetsPluginOptions {
  // assets pair to copy
  assets: MaybeArray<AssetPair>;
  // extra globby options to match paths to copy from
  globbyOptions: GlobbyOptions;
}
```
