# Penumbra

## Progress

**WIP**

Once it got accomplished, you can run commands below to enjoy enhanced monorepo workflow by [@nrwl/nx](https://nx.dev/)

([pnpm](https://github.com/pnpm/pnpm) is recommended as package manager in nx project.)

```bash
npm i @penumbra/nx-plugin-typegraphql -S
npm i @penumbra/nx-plugin-midway -S
npm i @penumbra/nx-plugin-prisma -S

nx g @penumbra/nx-plugin-typegraphql:resolver user --fields
nx g @penumbra/nx-plugin-midway:application midway-graphql-demo --graphql --typeorm
nx g @penumbra/nx-plugin-prisma:application prisma-app --graphql --sqlite
```

## plugins

### nx-plugin-typegraphql

- [ ] ObjectType
- [ ] Resolver
- [ ] Middleware
- [ ] Utils(Directives / Extensions / AuthChecker)
- [ ] Full Application (Apollo-Server / GraphQL-Yoga)

#### Features

- [ ] GraphQL-Code-Generator
- [ ] TypeORM Integration
- [ ] DataLoader

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
