import { Tree } from '@nrwl/devkit';
import { TypeGraphQLMiddlewareSchema } from '../schema';

import { getAvailableAppsOrLibs } from 'nx-plugin-devkit';

export function normalizeGenSchema(
  host: Tree,
  schema: Partial<TypeGraphQLMiddlewareSchema>
): TypeGraphQLMiddlewareSchema {
  const { apps, libs } = getAvailableAppsOrLibs(host);

  const appNames = apps.map((app) => app.appName);
  const libNames = libs.map((lib) => lib.libName);

  if (
    !appNames.includes(schema.appsOrLibs) &&
    !libNames.includes(schema.appsOrLibs)
  ) {
    throw new Error(`App or Lib ${schema.appsOrLibs} dose not exist`);
  }

  // FIXME: 如果不想作为provider，后一个问题应该根本不出现才对
  // if (!schema.asDIProvider && schema.diLibs) {
  //   devInfo('');
  // }

  if (!schema.directory) {
    schema.directory = 'middlewares';
  }

  return schema as TypeGraphQLMiddlewareSchema;
}
