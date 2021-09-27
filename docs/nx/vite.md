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

### preview

```bash
nx preview vite-app
```

Run `vite preview` command for project.
