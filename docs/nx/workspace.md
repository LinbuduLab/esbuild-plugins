# Workspace

Some extra enhancements on offical `@nrwl/workspace`:

**Outdated! Please use official `@nrwl/workspace` package.**

## Executors

- `nx-plugin-workspace:exec`

  Similar to `@nrwl/workspace:run-commands`, with enhancements below:

  - Use [`execa`](https://www.npmjs.com/package/execa) under the hood, support `preferLocal` `shell` and more options.
  - Support `ignoreFalsy`: will not append falsy value into command to execute, like `--watch=false`, which is useful in `Prisma` cli.
  - Support `useCamelCase`: control how args are transformed, kebab-case or camel-case?

## Generators

### react-scripts

```bash
nx g nx-plugin-workspace:react-scripts react-app
```

Create offical `Create-React-App` template application, and `React-Scripts` related targets
.
