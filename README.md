# Nx Plugins

[![Netlify Status](https://api.netlify.com/api/v1/badges/76741f4f-9793-44b8-a80e-a2787f621009/deploy-status)](https://app.netlify.com/sites/nx-plugins/deploys)
![npm](https://img.shields.io/npm/v/nx?label=nx%20version)
![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/w/LinbuduLab/nx-plugins)

**WARNING: This project are still under heavy developings.**

## Progress

- Detailed Documentations
- Enhancement

## Packages

### Nx Related Plugins

#### Available Plugin with Executors & Generators

- [nx-plugin-esbuild](packages/nx-plugin-esbuild)

  - executor: build / info
  - generator: init / setup

- [nx-plugin-vite](packages/nx-plugin-vite)

  - executor: build / serve / preview / info
  - generator: app / setup

- [nx-plugin-prisma](packages/nx-plugin-prisma)

  - executor: info
  - generator: init / remove / setup

- [nx-plugin-snowpack](packages/nx-plugin-snowpack)

  - executor: build / serve
  - generator: init / setup

- [nx-plugin-devkit](packages/nx-plugin-devkit): Provide utilities & helpers in Nx plugin developing.

- [nx-plugin-workspace](packages/nx-plugin-workspace): Workspace shared executors & generators.

  - executor: exec / light-node-serve / node-package / node-serve / setup
  - generator: react-scripts / setup

#### Under Developing Plugins

- nx-plugin-astro
- nx-plugin-icejs

### Derived Plugins

- ESBuild Plugins
- Snowpack Plugins
- (WIP) IceJS Plugins
- (WIP) Gatsby Plugins

## Scripts

- Collect Deps
- Create Playground
- Initialize Package
- (WIP) Release
- Format Configuration Files
