import {
  Tree,
  readProjectConfiguration,
  joinPathFragments,
} from '@nrwl/devkit';

import { isValidNamespace } from '../../../utils';
import {
  TypeGraphQLObjectTypeSchema,
  NormalTypeGraphQLObjectTypeSchema,
} from '../schema';
import { devWarn } from 'nx-plugin-devkit';
import { getAvailableAppsOrLibs } from 'nx-plugin-devkit';

export function normalizeSchema(
  host: Tree,
  schema: TypeGraphQLObjectTypeSchema
): NormalTypeGraphQLObjectTypeSchema {
  const { apps, libs } = getAvailableAppsOrLibs(host);

  const appNames = apps.map((app) => app.appName);
  const libNames = libs.map((lib) => lib.libName);

  if (!schema.objectTypeName) {
    throw new Error('ObjectType name required!');
  }

  if (
    !appNames.includes(schema.appOrLib) &&
    !libNames.includes(schema.appOrLib)
  ) {
    throw new Error(`app or lib ${schema.appOrLib} does not exist!`);
  }

  const appOrLibConfig = readProjectConfiguration(host, schema.appOrLib);

  // lib + undefined >>> CREATE libs/lib1/src/lib/x.ts (UPDATE libs/lib1/src/index.ts)
  // lib + types >>> CREATE libs/lib1/src/types/x.ts
  // app + undefined >>> CREATE apps/app1/src/app/graphql/x.ts
  // app + types >>> CREATE apps/app1/src/app/types/x.ts
  const generateDirectory = joinPathFragments(
    appOrLibConfig.sourceRoot,
    appOrLibConfig.projectType === 'library'
      ? schema.directory
        ? schema.directory
        : 'lib'
      : schema.directory
      ? joinPathFragments('app', schema.directory)
      : 'app/graphql'
  );

  // TODO:
  // 指定的app/lib 不存在时 抛出错误
  // 未指定app/lib 且不存在名为graphql的lib 创建名为graphql的lib来存放
  // 未指定app/lib 且名为graphql的lib已存在 抛出错误？

  // if (!schema.appOrLib && !libNames.includes('graphql')) {
  //   devInfo("lib name not specified, creating new lib 'graphql'");
  //   schema.appOrLib = 'graphql';
  // } else if (!schema.appOrLib && libNames.includes('graphql')) {
  //   devInfo("lib name not specified and lib 'graphql' exist, use it as target");
  //   schema.appOrLib = 'graphql';
  // }

  //  if (!libNames.includes(normalizedSchema.appOrLib)) {
  //     devInfo(`Creating new lib: ${normalizedSchema.appOrLib}`);
  //     await libraryGenerator(host, { name: normalizedSchema.appOrLib });
  //   }

  if (schema.extendTypeormBaseEntity && !schema.useTypeormEntityDecorator) {
    devWarn(
      "'extendTypeormBaseEntity' option require 'useTypeormEntityDecorator' to be true, set it automatically"
    );
    schema.useTypeormEntityDecorator = true;
  }

  if (!isValidNamespace(schema.namespaceExport)) {
    devWarn(`invalid namespaceExport, got ${schema.namespaceExport}, ignore`);
    schema.namespaceExport = undefined;
  }

  return {
    ...schema,
    generateDirectory,
    generateAtApp: appOrLibConfig.projectType === 'application',
  };
}
