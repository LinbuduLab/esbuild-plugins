---
title: ESBuild
description: ESBuild
permalink: /:slug
---

# ESBuild

Nx plugin integration with [ESBuild](https://github.com/evanw/esbuild).

## Generators

### init

```bash
nx generate nx-plugin-esbuild:init [app] --options
```

create a nx application project with esbuild-based workspace configuration, for example:

```json
{
  "node-playground": {
    "root": "apps/node-playground",
    "sourceRoot": "apps/node-playground/src",
    "projectType": "application",
    "targets": {
      "build": {
        "executor": "nx-plugin-esbuild:build",
        "options": {
          "main": "apps/node-playground/src/main.ts",
          "outputPath": "apps/node-playground/dist",
          "tsconfigPath": "apps/node-playground/tsconfig.app.json"
        }
      },
      "serve": {
        "executor": "nx-plugin-workspace:node-serve",
        "options": { "buildTarget": "node-playground:build" }
      },
      "info": {
        "executor": "nx-plugin-esbuild:info",
        "options": {
          "buildTarget": "node-playground:build",
          "serveTarget": "node-playground:serve"
        }
      }
    }
  }
}
```

You can find more supported schema options in [ESBuild.Generator.Init](/packages/nx-plugin-esbuild/src/generators/init/schema.json).

### setup

```bash
nx generate nx-plugin-esbuild:setup exist-node-app
```

Similar to `init` generator, but `setup` generator should be applied in exist application, and create related target & target configurations in `workspace.json`.

**Note: only node application are supported now.**

By default, it uses `serve` / `build` as target name when there doesnot exist `serve` / `build` target or you set `--override` option, or it uses `esbuild-build` / `esbuild-serve` as target name.

You can find more supported schema options in [ESBuild.Generator.Setup](/packages/nx-plugin-esbuild/src/generators/setup/schema.json).

## Executors

### build

Configure `nx-plugin-esbuild` in your workspace.json:

```json
{
  "your-app": {
    "root": "apps/node-playground",
    "sourceRoot": "apps/node-playground/src",
    "projectType": "application",
    "targets": {
      "build": {
        "executor": "nx-plugin-esbuild:build",
        "options": {
          "main": "apps/node-playground/src/main.ts",
          "outputPath": "apps/node-playground/dist",
          "tsconfigPath": "apps/node-playground/tsconfig.app.json"
        }
      }
    }
  }
}
```

And then execute it:

```bash
nx build node-playground --options
```

You can find more supported schema options in [ESBuild.Executor.Build](/packages/nx-plugin-esbuild/src/executors/build/schema.json).

### info

Display your nx related environments & packages version.

```json
{
  "your-app": {
    "root": "apps/node-playground",
    "sourceRoot": "apps/node-playground/src",
    "projectType": "application",
    "targets": {
      "esbuild-info": {
        "executor": "nx-plugin-esbuild:info",
        "options": {
          "buildTarget": "node-playground:esbuild-build",
          "serveTarget": "node-playground:esbuild-serve"
        }
      }
    }
  }
}
```
