---
title: Prisma
description: Prisma
permalink: /:slug
---

# Prisma

Nx plugin integration with [Prisma](https://www.prisma.io/)

```bash
# you can also skip prisma related installation, which will also be installed when executing generator:app
yarn add @prisma/client
yarn add nx-plugin-prisma prisma -D
# some required peer deps in nx workspace
yarn add @nrwl/node @nrwl/workspace @angular-devkit/schematics -D
```

## Generators

### init

```bash
nx g nx-plugin-prisma:init --app prisma-app --latestPackage
```

> `--latestPackage` means fetching latest version of Prisma package instead of use local version(`^3.0.2` for now)

Create a node application with prisma related initializations:

- Required dependencies([prisma](https://npmjs.com/package/prisma) & [@prisma/client](https://www.npmjs.com/package/@prisma/client)) installation.
- Workspace configuration corresponding to Prisma cli commands, `generate` / `db` / `studio` ...
- (Optional)Initial Prisma schema and env file setup.

You can then run `nx prisma-db-push prisma-app` command to push schema to database and generate Prisma Client.

The generated application use self-contained scripts to handle `dev`/`build`/`start` command, for example, `nx dev prisma-app` will execute this file:

```typescript
// scripts/dev.ts
import execa from 'execa';

export default async function dev() {
  await execa('ts-node-dev --respawn src/main.ts', {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true,
  });
}

(async () => {
  await dev();
})();
```

Plugin specified schema options:

- `prismaDirectory`: specify where prisma schema located in, **relative to project source root**. default: `app/prisma`.
- `schemaName`: specify prisma schema file name(without `.prisma` extname). default: `schema`.
- `datasourceProvider`: specify prisma datasource.provider, one of `sqlite` / `postgresql` / `mysql` / `sqlserver`. default: `sqlite`. **NOTE: only sqlite related works will be setup, so you need to handle manually if other provider is used.**
- `useProjectEnv`: should create `.env` file inside project root and use it. default: `true`.
- `initialSchema`: create initial simple prisma schema model definition.
- `collectArgs`: should use single-line command, for example, when setting as `true`, workspace target will be like:

  ```json
  {
    "executor": "nx-plugin-workspace:exec",
    "options": {
      "command": "prisma db push",
      "args": "--schema=src/app/prisma/prisma.schema --force-reset"
    }
  }
  ```

  Otherwise it will be:

  ```json
  {
    "executor": "nx-plugin-workspace:exec",
    "options": {
      "command": "prisma db push",
      "schema": "src/app/prisma/schema.prisma",
      "forceReset": true
    }
  }
  ```

- `noDBPull`: should omit `prisma db pull` from generated project workspace targets. default: `false`.
- `noDBPush`: should omit `prisma db push` from generated project workspace targets. default: `false`.
- `noStudio`: should omit `prisma studio` from generated project workspace targets. default: `false`.
- `noMigrate`: should omit `prisma migrate` from generated project workspace targets. default: `false`.

You can find more supported schema options in [Prisma.Generator.Init](/packages/nx-plugin-prisma/src/generators/init/schema.json).

### setup

```bash
nx g nx-plugin-prisma:setup exist-node-app
```

Similar to `init`, but `setup` generator should and can only be applied to exist application, which will also install deps, generate Prisma file, and add related workspace targsts for application.

Another difference is that `setup` generator doesnot add `dev`/`build`/`start` targets.

`setup` generator accepts similar schema options like `init` generator.

You can find more supported schema options in [Prisma.Generator.Setup](/packages/nx-plugin-prisma/src/generators/setup/schema.json).

## Executors

### info

```bash
nx info prisma-app
```

Report `nx workspace` & `Prisma` & `OS Informations`.

Add target configuration below (included in `init` / `setup` generator):

```json
{
  "prisma-app": {
    "targets": {
      "info": {
        "executor": "nx-plugin-prisma:info",
        "options": {}
      }
    }
  }
}
```
