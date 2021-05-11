# Nx-Plugins

## Progress

**WIP**

Once it got accomplished, you can run commands below to enjoy enhanced monorepo workflow by [@nrwl/nx](https://nx.dev/)

([pnpm](https://github.com/pnpm/pnpm) is recommended as package manager in nx project.)

```bash
npm i nx-plugin-typegraphql -D
npm i nx-plugin-prisma -D
npm i nx-plugin-esbuild -D
npm i nx-plugin-vite -D

nx g nx-plugin-typegraphql:app graphql-app --minimal

nx g nx-plugin-prisma:init prisma-app --datasourceProvider=sqlite
nx setup prisma-app

nx g nx-plugin-esbuild:init esbuild-app

nx g nx-plugin-vite:app vite-app --template react-tsx
```

## Packages

> Nx plugin with libraries.

- `nx-plugin-typegraphql`: Nx integration with TypeGraphQL
- `nx-plugin-prisma`: Nx integration with Prisma2
- `nx-plugin-serverless`: Nx integration with ALi-Cloud / Tencent-Cloud / Vercel Serverless Functions.

> Nx plugin with NodeJS frameworks.

- `nx-plugin-midway`: Nx integration with MidwayJS（Midway-Hooks、Midway-Serverless）

- `nx-plugin-koa`: Nx integration with Koa

- `nx-plugin-fastify`: Nx integration with Fastify

- `nx-plugin-hapi`: Nx integration with Hapi

- `nx-plugin-sails`: Nx integration with Sails

> Nx plugin with SSG frameworks.

- `nx-plugin-viteress`: Nx integration with VitePress

> Nx plugin with compiler/bundler.

- `nx-plugin-esbuild`: Nx integration with ESBuild
- `nx-plugin-swc`: Nx integration with SWC project
- `nx-plugin-vite`: Nx integration with Vite
- `nx-plugin-snowpack`: Nx integration with SnowPack
- `nx-plugin-parcel`: Nx integration with Parcel

> Nx plugin with React based framework. (like @nrwl/next)

- `nx-plugin-umi`: Nx integration with UmiJS
- `nx-plugin-blitz`: Nx integration with BlitzJS

> Useful utilities in Nx plugin development.

- `nx-plugin-devkit`

###

## Global Progress

- [ ] Release 0.1.0 for all plugins.
- [ ] Detailed documentation for all plugins. (README file will only include links to packages README)
- [ ] Refactor all plugins for methods extraction to`nx-plugin-devkit`
