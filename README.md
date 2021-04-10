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
npm i nx-plugin-vite
npm i nx-plugin-umi
npm i nx-plugin-ice
npm i nx-plugin-serverless

# generator only
nx g nx-plugin-typegraphql:resolver user --fields
nx g nx-plugin-midway:application midway-graphql-demo --graphql --typeorm
nx g nx-plugin-prisma:application prisma-app --graphql --sqlite

# generator + executor
nx g nx-plugin-esbuild:setup exist-app --target build-esbuild --watch
nx build-esbuild exist-app

nx g nx-plugin-swc:setup exist-app --target build-swc --watch
nx build-swc exist-app

nx g nx-plugin-vite:application vite-app --template react-tsx
nx vite-serve vite-app

nx g nx-plugin-umi:application umi-app
nx umi-serve umi-app

nx g nx-plugin-ice:application ice-app
nx ice-serve ice-app
```

## Packages

- `nx-plugin-typegraphql`:
- `nx-plugin-midway`:
- `nx-plugin-prisma`:
- `nx-plugin-serverless`:
- `nx-plugin-esbuild`:
- `nx-plugin-swc`:
- `nx-plugin-vite`:
- `nx-plugin-umi`:
- `nx-plugin-ice`:
- `esbuild-plugin-decorator`:
- `esbuild-plugin-node-externals`

## Plugins

### nx-plugin-typegraphql

- [x] ObjectType
- [x] Resolver
- [x] Middleware
- [x] Utils(Directive / Extension / Plugin / Scalar / Decorator)
- [ ] Full Application (Apollo-Server / GraphQL-Yoga)

### nx-plugin-midway

- [ ] Application
- [ ] Controller
- [ ] Service
- [ ] Middleware
- [ ] DTO
- [ ] Components
- [ ] Interceptor
- [ ] Serverless

### nx-plugin-prisma

**WIP**
