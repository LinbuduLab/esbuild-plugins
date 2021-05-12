import { ExecutorContext } from '@nrwl/devkit';
import { SnowpackServeSchema, NormalizedSnowpackServeSchema } from '../schema';
import { normalizeSchema as normalizeBasicSchema } from '../../../utils/normalize-schema';

export const normalizeSchema = (
  schema: SnowpackServeSchema,
  context: ExecutorContext
): NormalizedSnowpackServeSchema => {
  const normalizedBasicSchema = normalizeBasicSchema(schema, context);

  return {
    ...normalizedBasicSchema,
  };
};
