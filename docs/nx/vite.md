---
title: Vite
description: Vite
permalink: /:slug
---

# Vite

Nx plugin integration with [Vite](https://vitejs.dev/).

```bash
# you can also skip vite installation, which will also be installed when executing generator:app
yarn add nx-plugin-vite vite -D
# some required peer deps in nx workspace project
yarn add @nrwl/node @nrwl/workspace @nrwl/tao @angular-devkit/schematics -D
```

## Breaking Changes

- Since **1.2.0**, executor `serve` / `preview` can only be configured with Vite config file.

## Generators

### app

```bash
nx g nx-plugin-vite:app your-vite-app --framework=react
```

Create a official `Vite` template and add plugin related workspace targets in `workspace.json`.

Supported framework: `React`(default), `Vue`

### setup

```bash
nx g nx-plugin-vite:setup exist-app
```

Add plugin related workspace targets to **exist application**.

## Executors

**NOTE: In Nx-Vite project, it's recommended to configurate your vite project by `PROJECT/vite.config.ts`(which also has a higher priority) instead of schema options. When a option is defined in both ways, its resolve priority depends on Vite itself.**

**NOTE: In some situations, ternimal output may display abnormally, for example when running `nx serve vite`, the vite serve output may disappeared and left only `Nx-Vite [Start] Starting` text. So as a tmp solution, we use a simple ready log. This is indeed a bug and I'm still trying to fix it.**

### serve

```bash
nx serve vite-app
```

Run `vite` command for project.

Only few options are supported from schema:

- `root`: specify project root, if not configurated, will use `workspace.project.root` instead.
- `configFile`(required): specify vite config path, relative to project root(or `options.root` if it's specified).

Find more supported schema options in [Vite.Executor.Serve](/packages/nx-plugin-vite/src/executors/serve/schema.json).

### build

```bash
nx build vite-app
```

Run `vite build` command for project.

Only few options are supported from schema:

- `root`: specify project root, if not configurated, will use `workspace.project.root` instead.
- `configFile`(required): specify vite config path, relative to project root(or `options.root` if it's specified).
- `outDir`
- `watch`
- `write`
- `manifest`
- `emitAtRootLevel`(default: `false`): specify should emit built dist file in workspace root level, and `--outDir` will still be used for path calculation. For example:

  ```json
  {
    "outDir": "dist",
    "emitAtRootLevel": true
  }
  ```

  Configurations above will use `WORKSPACE_ROOT/dist` as dist directory, instead it will be `WORKSPACE_ROOT/APPS_DIR/vite-app/dist` if you set `emitAtRootLevel` to be `false`.

Find more supported schema options in [Vite.Executor.Build](/packages/nx-plugin-vite/src/executors/build/schema.json).

### preview

```bash
nx preview vite-app
```

Run `vite preview` command for project.

- `root`: specify project root, if not configurated, will use `workspace.project.root` instead.
- `configFile`(required): specify vite config path, relative to project root(or `options.root` if it's specified).

Find more supported schema options in [Vite.Executor.Preview](/packages/nx-plugin-vite/src/executors/preview/schema.json).
