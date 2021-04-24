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
npm i nx-plugin-ice -D
npm i nx-plugin-serverless -D
npm i nx-plugin-snowpack -D



nx g nx-plugin-typegraphql:resolver user --fields
nx g nx-plugin-typegraphql:application tgql-app --minimal
nx run tgql-app:gen --genql --doc


nx g nx-plugin-midway:application midway-graphql-app --graphql --typeorm
nx serve midway-graphql-app

nx g nx-plugin-prisma:application prisma-app --graphql --db=sqlite3
nx setup prisma-app

nx g nx-plugin-esbuild:init esbuild-app --watch
nx build esbuild-app

nx g nx-plugin-swc:init swc-app
nx build swc-app

nx g nx-plugin-vite:app vite-app --template react-tsx
nx serve vite-app

nx g nx-plugin-umi:app umi-app
nx serve umi-app

nx g nx-plugin-ice:app ice-app
nx serve ice-app

nx g nx-plugin-snowpack snowpack-app
nx serve snowpack-app
```

## Packages

> Nx plugin with libraries.

- `nx-plugin-typegraphql`:
- `nx-plugin-midway`:
- `nx-plugin-prisma`:
- `nx-plugin-serverless`:

> Nx plugin with bundler.

- `nx-plugin-esbuild`:
- `nx-plugin-swc`:
- `nx-plugin-vite`:

> Nx plugin with React based framework. (like @nrwl/next)

- `nx-plugin-umi`:
- `nx-plugin-ice`:

> Useful utilities in Nx plugin development.

- `nx-plugin-devkit`

### ESBuild-Plugins

> Avaliable Plugins:

- `esbuild-plugin-decorator`:
- `esbuild-plugin-node-externals`:
- `esbuild-plugin-ignore`

> Unavailable Pugins (Waiting for ESBuild plugin [buildEnd](*https://github.com/evanw/esbuild/issues/111#issuecomment-812829551*) hooks)

- `esbuild-plugin-filesize`
- `esbuild-plugin-hash`

> WIP

- `esbuild-plugin-static-site`
- `esbuild-plugin-circular-deps`
- `esbuild-plugin-notifier`
- `esbuild-plugin-graphql`

## Global Progress

- [ ] Release 0.1.0 for all plugins.
- [ ] Detailed documentation for all plugins. (README file will only include links to packages README)
- [ ] Refactor all plugins for `nx-plugin-devkit`

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

### nx-plugin-ice

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

### esbuild-plugin-hash

> Unique hashes generated by output file.

Inspired by [rollup-plugin-hash](https://github.com/phamann/rollup-plugin-hash)

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
