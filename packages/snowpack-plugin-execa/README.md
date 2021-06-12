# snowpack-plugin-execa

Use [execa](https://www.npmjs.com/package/execa) in snowpack run hook.

## Usage

**GitHub Repository/Homepage is private for now, if you got any troubles, just open issue in this [repo](https://github.com/linbudu599/Blog).**

```bash
npm i snowpack-plugin-execa -D
pnpm i snowpack-plugin-execa -D
yarn add snowpack-plugin-execa -D
```

```javascript
/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  plugins: [
    [
      'snowpack-plugin-execa',
      {
        commands: [
          { command: 'prisma', args: ['-v'] },
          { command: 'node', args: ['-v'] },
        ],
      },
    ],
  ],
};
```

## Configuration

```typescript
export interface ExecaPluginOptions {
  // multi commands to execute
  commands?: CommandItem[];
  // options shared by all commands
  sharedOptions?: Options;
  // if child process throw errors, throw it.
  throwOnCommandFailed?: boolean;
}

// execa(command, args, options)
export interface CommandItem {
  command?: string;
  args?: string[];
  options?: Options;
}
```
