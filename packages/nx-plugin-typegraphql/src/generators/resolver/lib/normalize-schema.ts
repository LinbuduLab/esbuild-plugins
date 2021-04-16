import { Tree } from '@nrwl/devkit';

import { getAvailableAppsOrLibs } from 'nx-plugin-devkit';
import { TypeGraphQLResolverSchema } from '../schema';

export function normalizeGenSchema(
  host: Tree,
  schema: Partial<TypeGraphQLResolverSchema>
): TypeGraphQLResolverSchema {
  const { apps, libs } = getAvailableAppsOrLibs(host);

  const appNames = apps.map((app) => app.appName);
  const libNames = libs.map((lib) => lib.libName);

  if (
    !appNames.includes(schema.appOrLibName) &&
    !libNames.includes(schema.appOrLibName)
  ) {
    throw new Error(`App or Lib ${schema.appOrLibName} dose not exist`);
  }

  if (!schema.directory) {
    schema.directory = 'resolvers';
  }

  return schema as TypeGraphQLResolverSchema;
}
