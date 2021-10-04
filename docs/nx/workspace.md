# Workspace

Some extra enhancements on offical `@nrwl/workspace`:

## Executors

- `nx-plugin-workspace:exec`

  Similar to `@nrwl/workspace:run-commands`, with enhancements below:

  - Use [`execa`](https://www.npmjs.com/package/execa) under the hood, support `preferLocal` `shell` and more options.
  - Support `ignoreFalsy`: will not append falsy value into command to execute, like `--watch=false`, which is useful in `Prisma` cli.
  - Support `useCamelCase`: control how args are transformed, kebab-case or camel-case?

- `nx-plugin-workspace:node-build`: `@nrwl/node:build`
- `nx-plugin-workspace:node-serve`: `@nrwl/node:serve`
- `nx-plugin-workspace:node-package`: `@nrwl/node:package`
- `nx-plugin-workspace:tsc`: `@nrwl/workspace:tsc`

## Generators

### react-scripts

```bash
nx g nx-plugin-workspace:react-scripts react-app
```

Create offical `Create-React-App` template application, and `React-Scripts` related targets
.
