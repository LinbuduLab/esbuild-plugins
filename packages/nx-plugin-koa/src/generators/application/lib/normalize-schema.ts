import { Tree } from '@nrwl/devkit';
import { normalizeNodeAppSchema } from 'nx-plugin-devkit';

import {
  KoaAppGeneratorSchema,
  KoaAppGeneratorExtraSchema,
  NormalizedKoaAppGeneratorSchema,
} from '../schema';

export function normalizeSchema(
  host: Tree,
  schema: KoaAppGeneratorSchema
): NormalizedKoaAppGeneratorSchema {
  const basicNormalizedAppGenSchema = normalizeNodeAppSchema(host, schema);
  const extraOptions: KoaAppGeneratorExtraSchema = {
    minimal: schema.minimal ?? false,
    routingControllerBased: schema.routingControllerBased ?? true,
    router: schema.router ?? true,
  };
  return {
    ...extraOptions,
    ...basicNormalizedAppGenSchema,
  };
}
