---
title: ESBuild
description: ESBuild
permalink: /:slug
---

# ESBuild

Nx plugin integration with [ESBuild](https://github.com/evanw/esbuild).

```bash
yarn add nx-plugin-esbuild esbuild --save-dev
# some required peer deps in nx workspace project
yarn add @nrwl/node @nrwl/workspace @nrwl/tao @angular-devkit/schematics -D
```

## Generators

### node-init

```bash
nx g nx-plugin-esbuild:node-init your-app-name
```

create a node application project with esbuild-based workspace configuration, for example:

```json
{
  "node-playground": {
    "targets": {
      "esbuild-build": {
        "executor": "nx-plugin-esbuild:build",
        "options": {
          "main": "apps/node-playground/src/main.ts",
          "outputPath": "apps/node-playground/dist",
          "tsconfigPath": "apps/node-playground/tsconfig.json"
        }
      },
      "esbuild-serve": {
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

- By default, we use `outputPath` inside project dir instead of hoist to workspace root. You can change this behavior by modifying the `outputPath` field.

Most of `ESBuild.BuildOptions` are supported in schema options, but it's recommended to use extend config file for programmatic configuration, so in initial generated application, there'll be a `nx-esbuild.ts` config file exist in project root:

```typescript
import { NXESBuildConfigExport } from 'nx-plugin-esbuild';
import { esbuildPluginAliasPath } from 'esbuild-plugin-alias-path';

export default {
  esbuildOptions: {
    plugins: [
      esbuildPluginAliasPath({
        alias:
          process.env.NODE_ENV === 'production'
            ? {
                './environments/environment':
                  './environments/environment.prod.ts',
              }
            : {},
        skip: process.env.NODE_ENV !== 'production',
        cwd: __dirname,
      }),
    ],
  },
  watchOptions: {},
} as NXESBuildConfigExport;
```

You can configurate `buildOptions` and `watchOptions` here, which makes configuration works flexible and easy to use.

- `buildOptions`: `ESBuild.BuildOptions`, which will override plugin built-in `ESBuild` config.
- `watchOptions`: `chokidar.WatchOptions`, which will override plugin built-in `chokidar` config.

**NOTE: To load `.ts` config file by `require`(use [@adonisjs/require-ts](https://www.npmjs.com/package/@adonisjs/require-ts) under the hood), you will need `compilerOptions.module` to be set as `CommonJS`.
Failure to load does not cause the program to exit but to skip loading config file.**

**NOTE: Make sure to have `extendConfig: 'config-path.ext'`(relative to project root) in workspace config(`project.targets.esbuild-build.options`) when you wants to use extend config file.**

More supported schema options can be found in [ESBuild.Generator.NodeInit](/packages/nx-plugin-esbuild/src/generators/node-init/schema.json).

### node-setup

```bash
nx g nx-plugin-esbuild:node-setup exist-node-app
```

Similar to `node-init` generator, but `node-setup` generator should be applied in exist node application, and create related target configurations in `workspace.json`.

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
