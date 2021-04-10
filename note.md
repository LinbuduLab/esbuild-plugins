# note

## progress





## commands

- nx list @penumbra/nx-plugin-typegraphql
- (dist 目录) pnpm link @penumbra/nx-plugin-typegraphql
- packages下多个plugin？ nx-plugin-typegraphql nx-plugin-midway nx-plugin-prisma
- nx generate @nrwl/nx-plugin:executor [executor] --project=[pluginName]
- nx generate @nrwl/nx-plugin:generator [generatorName] --project=[pluginName]
- nx run nx-plugin-typegraphql:build
- nx g @penumbra/nx-plugin-typegraphql:objecttype
- nx g @nrwl/nx-plugin:plugin [pluginName]

## executors

- nx g @nrwl/nx-plugin:executor  my-executor --project=my-plugin
- 在workspace.json project.targets 中添加
- \[packageName]:\[command]
- 需要executor的：esbuild swc prisma midway serverless vite

## type-graphql

- object type
  - [x] Create class decorated by `@ObjectType()`.
  - [x] Implement `@InterfaceType()`.
  - [x] Generate create/update/delete DTO.
  - [x] Use `Class-Validator` / `Joi` as schema validator.
  - [x] Integrate TypeORM `@Entity()`.
  - [x] Integrate TypeORM `BaseEntity`.
  - [x] Specify namespace export in index file, e.g: `export * as UserType from "./user.type.ts"`.
  - [ ] Generate primitive props with ObjectType & DTO.
- middleware
  - [x] Functional / Class
  - [x] Dependency Injection(TypeDI / Inversify)
  - [x] Generate to apps/libs directory
  - [x] Higher order (`@UseMiddleware` wrapper)
- resolver
  - [x] Operation Included: Query/Mutation/Subscription
  - [x] Full import from type-graphql: @Arg...
  - [x] FieldResolver
- application
  - 复用generator
  - 只支持生成为app
  - database 和 orm 都支持空
- util
  - extensions
  - plugins
  - directives
  - scalars
  - decorator

## esbuild

- executor:build(tsc)
- executor:serve(etsc)
- generator:setup；为已经存在的项目，新增esbuild-build命令，使用nx-plugin-esbuild:build进行构建，新增esbuild-serve命令，使用nx-plugin-esbuild:serve
- generator:init：创建一个全新的项目

## issues

-  File 'D:/nx-plugin-typegraphql/packages/esbuild-plugin-decorator/src/lib/parse-config.ts' is not under 'rootDir' 'packages/nx-plugin-esbuild'. 'rootDir' is expected to contain all source files.
  - https://github.com/nrwl/nx/blob/master/packages/node/src/executors/package/schema.json
- submodule: (publishable) 要cd 到nx-plugin-esbuild 然后 pnpm link esbuild-plugin-node-externals 

-  https://github.com/nrwl/nx/issues/2794
- File 'D:/nx-plugin-typegraphql/packages/esbuild-plugin-decorator/src/lib/parse-config.ts' is not under 'rootDir' 'packages/nx-plugin-esbuild'. 'rootDir' is expected to contain all source files.
  - https://github.com/nrwl/nx/blob/master/packages/node/src/executors/package/schema.json
  - https://nx.dev/latest/angular/structure/buildable-and-publishable-libraries
  - https://github.com/nrwl/nx/issues/4620
  - nx build nx-plugin-esbuild --with-deps
  - nx g @nrwl/node:lib esbuild-plugin-decorator --publishable --importPath=esbuild-plugin-decorator
