# Nx-Plugins

## Progress

**WIP**

Once it got accomplished, you can run commands below to enjoy enhanced monorepo workflow by [@nrwl/nx](https://nx.dev/)

([pnpm](https://github.com/pnpm/pnpm) is recommended as package manager in nx project.)

```bash
npm i nx-plugin-prisma -D
npm i nx-plugin-esbuild -D
npm i nx-plugin-vite -D

nx g nx-plugin-prisma:init prisma-app --datasourceProvider=sqlite

nx prisma-generate prisma-app

nx g nx-plugin-esbuild:init esbuild-app

nx esbuild esbuild-app

nx g nx-plugin-vite:app vite-app --template react-tsx

nx serve vite-app
```

## Packages

> Nx plugin with libraries.

- `nx-plugin-typegraphql`: Nx integration with TypeGraphQL
- `nx-plugin-prisma`: Nx integration with Prisma2
- `nx-plugin-serverless`: Nx integration with ALi-Cloud / Tencent-Cloud / Vercel Serverless Functions.

> Nx plugin with NodeJS frameworks.

- `nx-plugin-midway`: Nx integration with MidwayJS（Midway-Hooks、Midway-Serverless）

- `nx-plugin-koa`: Nx integration with Koa

> Nx plugin with SSG frameworks.

- `nx-plugin-viteress`: Nx integration with VitePress
- `nx-plugin-vueress`: Nx integration with Vuepress

> Nx plugin with compiler/bundler.

- `nx-plugin-esbuild`: Nx integration with ESBuild
- `nx-plugin-rollup`: Nx integration with Rollup
- `nx-plugin-swc`: Nx integration with SWC project
- `nx-plugin-vite`: Nx integration with Vite
- `nx-plugin-snowpack`: Nx integration with SnowPack
- `nx-plugin-parcel`: Nx integration with Parcel

> Nx plugin with React based framework. (like @nrwl/next)

- `nx-plugin-umi`: Nx integration with UmiJS

> Useful utilities in Nx plugin development.

- `nx-plugin-devkit`

> Tools collections(node-serve/node-build/light-node-serve/...)

- `nx-plugin-workspace`

> Future development plan.

- `nx-plugin-blitz`: Nx integration with BlitzJS
- `nx-plugin-dumi`: Nx integration with DUmi

## Global Progress

- [ ] Release 0.1.0 for all plugins.
- [ ] Detailed documentation for all plugins. (README file will only include links to packages README)
- [ ] Refactor all plugins for methods extraction to`nx-plugin-devkit`
- [ ] Test cases
