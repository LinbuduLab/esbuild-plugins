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

nx g nx-plugin-typegraphql:resolver user --fields
nx g nx-plugin-midway:application midway-graphql-demo --graphql --typeorm
nx g nx-plugin-prisma:application prisma-app --graphql --sqlite
```

## Packages

- `nx-plugin-typegraphql`:
- `nx-plugin-midway`:
- `nx-plugin-prisma`:
- `nx-plugin-serverless`:
- `nx-plugin-esbuild`:
- `nx-plugin-swc`:

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
