---
title: Snowpack
description: Snowpack
permalink: /:slug
---

# Snowpack

Nx plugin integration with [Snowpack](https://www.snowpack.dev/)

```bash
# you can also skip snowpack installation, which will also be installed when executing generator:app
yarn add nx-plugin-snowpack snowpack -D
# some required peer deps in nx workspace project
yarn add @nrwl/node @nrwl/workspace @angular-devkit/schematics -D
```

## Generators

### app

```bash
nx g nx-plugin-snowpack:app snowpack-app
```

Create official `Snowpack` + `React` template and add plugin related workspace targets.

### setup

```bash
nx g nx-plugin-snowpack:setup exist-app
```

Add plugin related workspace targets to exist application.

## Executors

**NOTE: In Nx-Snowpack project, it's recommended to configurate your snowpack project by `PROJECT/snowpack.config.cjs`(which also has a higher priority) instead of schema options. Schema options will be ignored totally when config path specified.**

### serve

```bash
nx serve snowpack-app
```

Run `snowpack dev` command for project.

Only few options are supported from schema:

- `root`: specify project root, if not configurated, will use `workspace.project.root` instead.
- `configPath`(required): specify vite config path, relative to project root(or `options.root` if it's specified).
- `verbose`: enable snowpack verbose logging.
- `clearCache`:enable snowpack clear cache.
- `open`: should open browser window.

Find more supported schema options in [Snowpack.Executor.Serve](/packages/nx-plugin-snowpack/src/executors/serve/schema.json).

### build

```bash
nx build snowpack-app
```

Run `snowpack build` command for project.

Only few options are supported from schema:

- `root`: specify project root, if not configurated, will use `workspace.project.root` instead.
- `configPath`(required): specify vite config path, relative to project root(or `options.root` if it's specified).
- `watch`: enable build watching.
- `verbose`: enable snowpack verbose logging.
- `clearCache`:enable snowpack clear cache.
- `clear`:enable snowpack clear.

Find more supported schema options in [Snowpack.Executor.Build](/packages/nx-plugin-snowpack/src/executors/build/schema.json).
