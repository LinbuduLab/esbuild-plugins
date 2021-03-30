# note

- nx list @penumbra/nx-plugin-typegraphql
- (dist 目录) pnpm link @penumbra/nx-plugin-typegraphql
- packages下多个plugin？ nx-plugin-typegraphql nx-plugin-midway nx-plugin-prisma
- nx generate @nrwl/nx-plugin:executor [executor] --project=[pluginName]
- nx generate @nrwl/nx-plugin:generator [generatorName] --project=[pluginName]
- nx run nx-plugin-typegraphql:build
- nx g @penumbra/nx-plugin-typegraphql:objecttype
- nx g @nrwl/nx-plugin:plugin [pluginName]

## type-graphql

- object type
  - [x] Create class decorated by `@ObjectType()`.
  - [x] Implement `@InterfaceType()`.
  - [x] Generate create/update/delete DTO.
  - [x] Use `Class-Validator` / `Joi` as schema validator.
  - [x] Integrate TypeORM `@Entity()`.
  - [x] Integrate TypeORM `BaseEntity`.
  - [ ] Specify namespace export in index file, e.g: `export * as UserObjectType from "./user.type.ts"`.
  - [ ] Generate primitive props with ObjectType & DTO.
