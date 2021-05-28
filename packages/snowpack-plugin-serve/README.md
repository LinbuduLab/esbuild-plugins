# snowpack-plugin-serve

Snowpack plugin for static serve.

## Usage

**GitHub Repository/Homepage is private for now, if you got any troubles, just open issue in this [repo](https://github.com/linbudu599/Blog).**

```bash
npm i serve snowpack-plugin-serve -D
pnpm i serve snowpack-plugin-serve -D
yarn add serve snowpack-plugin-serve -D
```

**Put this plugin at the last of plugin list to avoid blocking.**

```javascript
/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  plugins: [
    // ... other plugins
    // must be the last one!
    [
      'snowpack-plugin-serve',
      {
        execaOptions: {},
        serveArgs:[]
      },
    ],
  ]
};
```

## Configuration

```typescript
export interface ServePluginOptions {
  // default:
  // preferLocal: true
  // stdio: "inherit"
  execaOptions?: ExecaOptions;
  // default: "-s"
  // This option will be passed to serve command
  // e.g. ["--single","--listen 5050"] -> serve --single --listen 5050 {buildDir}
  // The last arg will always be buildDir
  serveArgs?: string[];
}
```
