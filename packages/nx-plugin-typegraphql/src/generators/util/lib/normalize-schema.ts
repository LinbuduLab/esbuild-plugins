import {
  names,
  readProjectConfiguration,
  joinPathFragments,
  Tree,
} from '@nrwl/devkit';
import { getAvailableAppsOrLibs } from 'nx-plugin-devkit';

import {
  TypeGraphQLUtilSchema,
  NormalizedTypeGraphQLUtilSchema,
} from '../schema';

export function normalizeSchema(
  host: Tree,
  schema: TypeGraphQLUtilSchema
): NormalizedTypeGraphQLUtilSchema {
  const { apps, libs } = getAvailableAppsOrLibs(host);

  const appNames = apps.map((app) => app.appName);
  const libNames = libs.map((lib) => lib.libName);

  if (
    !appNames.includes(schema.appOrLib) &&
    !libNames.includes(schema.appOrLib)
  ) {
    throw new Error(`App or Lib ${schema.appOrLib} does not exist!`);
  }

  const appOrLibConfig = readProjectConfiguration(host, schema.appOrLib);

  // type  directory   util-type
  // lib + undefined + directive >>> CREATE libs/lib1/src/directives/x.ts (UPDATE libs/lib1/src/index.ts)
  // lib + undefined + plugin >>> CREATE libs/lib1/src/plugins/x.ts (UPDATE libs/lib1/src/index.ts)

  // lib + undefined + extensions >>> CREATE libs/lib1/src/extensions/x.ts (UPDATE libs/lib1/src/index.ts)
  // lib + undefined + decorator >>> CREATE libs/lib1/src/decorators/x.ts (UPDATE libs/lib1/src/index.ts)
  // lib + undefined + scalar >>> CREATE libs/lib1/src/scalars/x.ts (UPDATE libs/lib1/src/index.ts)

  // lib + someDir + directive >>> CREATE libs/lib1/src/someDir/x.ts

  // app + undefined + directive >>> CREATE apps/app1/src/app/directives/x.ts
  // app + someDir + directive >>> CREATE apps/app1/src/app/someDir/x.ts

  // directive
  const { fileName: originFileName } = names(schema.type);
  // directives
  const dirName = `${originFileName}s`;

  // FIXME:
  const generateDirectory = joinPathFragments(
    appOrLibConfig.sourceRoot,
    appOrLibConfig.projectType === 'library'
      ? // lib + directory
        schema.directory
        ? // lib
          schema.directory
        : dirName
      : schema.directory
      ? // app + directory
        joinPathFragments('app', schema.directory)
      : // app
        joinPathFragments('app', dirName)
  );

  return {
    ...schema,
    projectSourceRoot: appOrLibConfig.sourceRoot,
    generateDirectory,
    generateAtApp: appOrLibConfig.projectType === 'application',
  };
}
