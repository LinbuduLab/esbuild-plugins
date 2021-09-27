---
title: Prisma
description: Prisma
permalink: /:slug
---

# Prisma

Nx plugin integration with [Prisma](https://www.prisma.io/)

## Generators

### init

```bash
nx g nx-plugin-prisma:init --app prisma-app --latestPackage
```

> `--latestPackage` means fetching latest version of Prisma package

Create a node application with prisma relateds initializations:

- Required dependencies([prisma](https://npmjs.com/package/prisma) & [@prisma/client](https://www.npmjs.com/package/@prisma/client))
- Workspace configuration corresponding to Prisma cli commands, `generate` / `db` / `studio` ...
- Initial Prisma schema

You can then run `nx prisma-db-push prisma-app` command to push schema to database and generate PrismaClient.

The generated application use self-contained scripts to handler dev/build/start, for example, `nx dev prisma-app` will execute this file:

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

You can find more supported schema options in [Prisma.Generator.Init](/packages/nx-plugin-prisma/src/generators/init/schema.json).

### setup

```bash
nx g nx-plugin-prisma:setup --app prisma-app
```

Similar to `init`, but `setup` generator should and can only be applied in exist application, which will also install deps, generate Prisma file, and add related workspace targsts for application.

Another difference is that `setup` generator doesnot add `dev`/`build`/`start` targets.

You can find more supported schema options in [Prisma.Generator.Setup](/packages/nx-plugin-prisma/src/generators/setup/schema.json).

## Executors

### info

```bash
nx info prisma-app
```

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
