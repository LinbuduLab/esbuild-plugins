---
title: Snowpack
description: Snowpack
permalink: /:slug
---

# Snowpack

Nx plugin integration with [Snowpack](https://www.snowpack.dev/)

```bash
yarn add nx-plugin-snowpack -D
# some required peer deps
yarn add @nrwl/node @nrwl/workspace @angular-devkit/schematics -D
```

## Generators

### app

```bash
nx g nx-plugin-snowpack:app snowpack-app
```

Create a Snowpack + React template based application(official version) and related workspace targets.

### setup

```bash
nx g nx-plugin-snowpack:setup exist-app
```

Add snowpack related workspace targets to exist application.

## Executors

**NOTE: In Nx-Snowpack project, it's recommended to configurate your snowpack project by `PROJECT/snowpack.config.js`(which also has a higher priority) instead of schema options. Schema options will be ignored when config path specified.**

### serve

```bash
nx serve snowpack-app
```

Run `snowpack dev` command for project.

Find more supported schema options in [Snowpack.Executor.Serve](/packages/nx-plugin-snowpack/src/executors/serve/schema.json).

### build

```bash
nx build snowpack-app
```

Run `snowpack build` command for project.

Find more supported schema options in [Snowpack.Executor.Build](/packages/nx-plugin-snowpack/src/executors/build/schema.json).
