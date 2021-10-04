---
title: DevKit
description: devkit
permalink: /:slug
---

# Devkit

Useful utilities in nx plugin development.

## Executors

- `ensureProjectConfig`: Ensure project has `projectSourceRoot` & `projectRoot` config fields.
- `envInfo`: Report system environment informations, used by `info` executor.
- `readTargetOptions`: Read target options by given target.

You can found more executors utils in `@nrwl/devkit`.

## Generators

- `installPackagesTask`: Execute install task in `app` generator.
- `minimalNormalizeOptions` `minimalAddFiles` `minimalProjectConfiguration`: These methods help you to create simple application generator which requires only serveral schema options like`name` `tags` `directory`.
- `createNodeAppBuildConfig` `createNodeAppServeConfig`: Compose build /serve configuration for node project in `workspace.project`
- `setupProxy` `updateNodeAppDeps` `initializeNodeApp` `createNodeAppProject` `createNodeAppFiles`: Utilities for creating node application.
- `createNodeInitTask` `createNodeJestTask` `createNodeLintTask`: Utilities for initialzing node application.
- `normalizeNodeAppSchema`: Normalize node application schema, including node specified options.
- `createPackageJSON` `updatePackageJson`: Operating your `package.json` with ease.

## Workspace

- `checkProjectExist`: Check does project exist in current workspace.
- `getAvailableAppsLibs`: Get all avaliable apps & libs.
- `setDefaultProject`: Set workspace default project if no specified default project exists.
- `updateGitIgnore` `updatePrettierIgnore`: Update ignore file.

## Utils

- `normalizeAssets` `copyAssetFiles`: Normalize assets configuration and do copy.
- `normalizeFileReplacements` `fileReplacements2Alias`: Normalize file replacements, transform them into alias form.
