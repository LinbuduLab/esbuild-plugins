# Nx-Plugins

## Progress

**WIP**

Once it got accomplished, you can run commands below to enjoy enhanced monorepo workflow by [@nrwl/nx](https://nx.dev/)

([pnpm](https://github.com/pnpm/pnpm) is recommended as package manager in nx project.)

```bash
npm i nx-plugin-typegraphql -D
npm i nx-plugin-midway -D
npm i nx-plugin-prisma -D
npm i nx-plugin-esbuild -D
npm i nx-plugin-swc -D
npm i nx-plugin-vite -D
npm i nx-plugin-umi -D
npm i nx-plugin-serverless -D
npm i nx-plugin-snowpack -D
npm i nx-plugin-parcel -D
npm i nx-plugin-vitepress -D


# create TypeGraphQL Resolver includes FieldResolver
nx g nx-plugin-typegraphql:resolver user --fields
# create minimal application based on TypeGraphQL + Apollo
nx g nx-plugin-typegraphql:application graphql-app --minimal
# @graphql/code-gen & genql & @2fd/graphdoc generation
nx run tgql-app:gen --genql --doc --codegen

# create empty application with SQLite
nx g nx-plugin-prisma:init prisma-app --datasourceProvider=sqlite
nx setup prisma-app

# create application based on ESBuild
nx g nx-plugin-esbuild:init esbuild-app
nx serve esbuild-app
nx build esbuild-app

# create application based on Vite + React
nx g nx-plugin-vite:app vite-app --template react-tsx
nx serve vite-app
nx build vite-app
nx info vite-app
```

## Packages

> Nx plugin with libraries.

- `nx-plugin-typegraphql`: Nx integration with TypeGraphQL
- `nx-plugin-prisma`: Nx integration with Prisma2
- `nx-plugin-serverless`: Nx integration with ALi-Cloud / Tencent-Cloud / Vercel Serverless Functions.

> Nx plugin with NodeJS framworks.

- `nx-plugin-midway`: Nx integration with MidwayJS
- `nx-plugin-koa`: Nx integration with Koa
- `nx-plugin-fastify`: Nx integration with Fastify

> Nx plugin with static site generation frameworks.

- `nx-plugin-viteress`: Nx integration with VitePress

> Nx plugin with compiler/bundler.

- `nx-plugin-esbuild`: Nx integration with ESBuild
- `nx-plugin-swc`: Nx integration with SWC project
- `nx-plugin-vite`: Nx integration with Vite
- `nx-plugin-snowpack`: Nx integration with SnowPack

> Nx plugin with React based framework. (like @nrwl/next)

- `nx-plugin-umi`: Nx integration with UmiJS

> Useful utilities in Nx plugin development.

- `nx-plugin-devkit`

### ESBuild-Plugins

> Avaliable Plugins:

- `esbuild-plugin-decorator`:
- `esbuild-plugin-node-externals`:
- `esbuild-plugin-ignore`

> Unavailable Pugins (Waiting for ESBuild plugin [buildEnd](*https://github.com/evanw/esbuild/issues/111#issuecomment-812829551*) hooks)

- `esbuild-plugin-filesize`
- `esbuild-plugin-html`

> WIP

- `esbuild-plugin-notifier`
- `esbuild-plugin-graphql`
- `esbuild-plugin-alias-path`
- `esbuild-plugin-node-polyfill`

### Vite-plugins

- `vite-plugin-graphql`
- `vite-plugin-prisma`
- `vite-plugin-gundam`

### Parcel-plugins

- `parcel-plugin-assets`

## Global Progress

- [ ] Release 0.1.0 for all plugins.
- [ ] Detailed documentation for all plugins. (README file will only include links to packages README)
- [ ] Refactor all plugins for methods extraction to`nx-plugin-devkit`

## Plugins

### nx-plugin-typegraphql

#### generators

- [x] ObjectType
  - [ ] Props
- [x] Resolver
  - [x] FieldResolver
- [x] Middleware
  - [x] Class
  - [x] Functional
- [x] Utils(Directive / Extension / Plugin / Scalar / Decorator)
- [ ] Full Application
  - [ ] Apollo + TypeGraphQL Minimal
  - [ ] Apollo + TypeGraphQL Full-Featured
  - [ ] Nest + TypeGraphQL Minimal
  - [ ] Nest + TypeGraphQL Full-Featured
  - [ ] Midway + TypeGraphQL

### nx-plugin-midway

#### generators

- [ ] Application
  - [ ] REST / GraphQL
  - [ ] TypeORM / Prisma
- [ ] Controller
- [ ] Service
- [ ] Middleware
- [ ] Component
- [ ] Interceptor
- [ ] Integration
  - [ ] Midway-Serverless
  - [ ] Midway-Hooks

#### executors

- [ ] serve (midway-bin dev)
- [ ] build (midway-bin build)
- [ ] deploy (pm2 / serverless)

### nx-plugin-prisma

#### generators

- [ ] Schema
- [ ] Application
  - [ ] REST / GraphQL
  - [ ] Vanilla NodeJS / NestJS

### executors

### nx-plugin-esbuild

#### generators

- [ ] Init (Create new project)

- [ ] Setup (Add ESBuild commands for existing project)

### executors

- [ ] build
- [ ] serve

### nx-plugin-swc

#### generators

- [ ] Init (Create new project)

- [ ] Setup (Add SWC commands for existing project)

### executors

- [ ] build
- [ ] serve

### nx-plugin-vite

#### generators

- [ ] Application

  - [ ] React / Vue
  - [ ] GraphQL (Apollo-Client)

- [ ] Setup(convert exist React / Vue project)

### executors

- [ ] serve (vite)
- [ ] build (vite build)
- [ ] preview (vite preview)

### nx-plugin-umi

> **Experimental**

#### generators

### executors

### nx-plugin-snowpack

> **Experimental**

#### generators

### executors

### Possible Plugins

- nx-plugin-vuepress(vitepress?)
- nx-plugin-dumi

## ESBuild-Plugins

### esbuild-plugin-decorator

> When TypeScript decorators are detected, use tsc for file compilation.

Inspired by [@anatine/esbuild-decorators](https://github.com/anatine/esbuildnx/tree/main/packages/esbuild-decorators)

### esbuild-plugin-node-externals

> Find and register all external modules to esbuild build.externals.

Inspired by [esbuild-node-externals](https://github.com/pradel/esbuild-node-externals)

### esbuild-plugin-ignore

> Ignore deps in building.

Inspired by [Webpack IgnorePlugin](https://webpack.js.org/plugins/ignore-plugin/)

### esbuild-plugin-graphql

> `.graphql` / `.gql` file import support.

Insipred by [vite-plugin-graphql](https://github.com/hronro/vite-plugin-graphql)

### esbuild-plugin-filesize

> Display filesize after build.

Inspired by [rollup-plugin-filesize](https://github.com/ritz078/rollup-plugin-filesize)

### esbuild-plugin-html

> Html template + script insert made easy.

> https://github.com/remorses/esbuild-plugins/blob/master/html/src/index.ts
> Inspired by [html-webpack-plugin]() + [rollup-plugin-static-site](https://gitlab.com/thekelvinliu/rollup-plugin-static-site)

### esbuild-plugin-circular-deps

> Check circular deps.

Inspired by [circular-dependency-plugin](https://github.com/aackerman/circular-dependency-plugin)

### esbuild-plugin-notifier

> OS level notifications for building.

Inspired by [webpack-build-notifier](https://github.com/RoccoC/webpack-build-notifier)
