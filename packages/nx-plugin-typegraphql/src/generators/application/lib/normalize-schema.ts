import { Tree } from '@nrwl/devkit';

import {
  NormalizedTypeGraphQLApplicationSchema,
  TypeGraphQLApplicationSchema,
  TypeGraphQLApplicationExtraSchema,
} from '../schema';
import { normalizeNodeAppSchema } from 'nx-plugin-devkit';

export function normalizeSchema(
  host: Tree,
  schema: TypeGraphQLApplicationSchema
): NormalizedTypeGraphQLApplicationSchema {
  const basicNormalizedAppGenSchema = normalizeNodeAppSchema(host, schema);

  const extraOptions: TypeGraphQLApplicationExtraSchema = {
    database: schema.database ?? 'SQLite',
    orm: schema.orm ?? 'Prisma',
    server: schema.server ?? 'Apollo-Server',
    tools: schema.tools ?? [],
  };

  return {
    ...extraOptions,
    ...basicNormalizedAppGenSchema,
  };
}
