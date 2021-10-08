---
title: Astro
description: astro
permalink: /:slug
---

# Astro

Nx plugin integration with [Astro](https://astro.build).

NOTE BEFORE START:

To use `Astro` in nx workspace, you will need to do following steps:

- Enable Yarn Workspace
- Add `Astro` application and required dependencies to `workspaces.nohoist` configuration:

  ```json
  {
    "workspaces": {
      "packages": ["apps/your-astro-app"],
      "nohoist": [
        "**/astro",
        "**/@astrojs/**",
        "**/snowpack",
        "**/@snowpack/**"
      ]
    }
  }
  ```

  > If you're using Yarn 2.x, see [nmHoistingLimits](https://yarnpkg.com/configuration/yarnrc#nmHoistingLimits) for correct configuration.

```bash
yarn add nx-plugin-astro -D
# some required peer deps in nx workspace project
yarn add @nrwl/workspace @nrwl/tao @angular-devkit/schematics -D
```

## Generators

### app

```bash
nx g nx-plugin-astro:app your-astro-app
```

Create a `Vue` + `React` + `Solid` + `Svelte` template and add plugin related workspace targets in `workspace.json`.

**As the restriction mentioned above, we need to run `yarn install` again to put app related dependencies into `PROJECT/node_modules`.**

**NOTE: Preact is not supported in workspace usage.**

## Executors

[As astro doesnot expose its cli api](https://github.com/snowpackjs/astro/blob/main/packages/astro/package.json#L13), plugin now works by `nx-plugin-workspace:exec`(which is similar to `@nrwl/workspace:run-commands`):

```json
{
  "targets": {
    "dev": {
      "executor": "nx-plugin-workspace:exec",
      "options": {
        "command": "astro dev",
        "cwd": "e2e/astro-app",
        "parallel": false,
        "color": true,
        "useCamelCase": false,
        "useLocalPackage": true,
        "shell": true
      }
    },
    "build": {
      "executor": "nx-plugin-workspace:exec",
      "options": {
        "command": "astro build",
        "cwd": "e2e/astro-app",
        "parallel": false,
        "color": true,
        "useCamelCase": false,
        "useLocalPackage": true,
        "shell": true
      }
    }
  }
}
```
