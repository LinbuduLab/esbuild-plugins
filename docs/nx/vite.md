---
title: Vite
description: Vite
permalink: /:slug
---

# Vite

Nx plugin integration with [Vite](https://vitejs.dev/)

## Generators

### app

```bash
nx g nx-plugin-vite:app  --name vite-app
```

Create a Vite + React template based application(official version) and related workspace targets.

You will need to install deps manually for now.

```bash
yarn add react react-dom --save
yarn add @types/react @types/react-dom @vitejs/plugin-react-refresh typescript vite --save-dev
```

### setup

```bash
nx g nx-plugin-vite:app --project exist-vite-app
```

Add vite related workspace targets to exist application.

## Executors

**NOTE: In Nx-Vite project, it's recommended to configurate your vite project by `PROJECT/vite.config.ts`(which also has a higher priority) instead of schema options.**

### serve

```bash
nx serve vite-app
```

Run `vite` command for project.

Find more supported schema options in [Vite.Executor.Serve](/packages/nx-plugin-vite/src/executors/serve/schema.json).

### build

```bash
nx build vite-app
```

Run `vite build` command for project.

Find more supported schema options in [Vite.Executor.Build](/packages/nx-plugin-vite/src/executors/build/schema.json).

Extra schema options:

- `emitAtRootLevel`(default: `false`): Specify should emit built dist file in workspace root level, and `--outDir` will still be used for path calculation. For example:

  ```json
  {
    "outDir": "dist",
    "emitAtRootLevel": true
  }
  ```

  Configurations above will use `WORKSPACE_ROOT/dist` as dist directory, instead it will be `WORKSPACE_ROOT/APPS_DIR/vite-app/dist` if you set `emitAtRootLevel` to be `false`.

### preview

```bash
nx preview vite-app
```

Run `vite preview` command for project.
