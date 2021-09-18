import { ExecutorContext } from '@nrwl/devkit';
import { SnowpackBuildSchema, NormalizedSnowpackBuildSchema } from '../schema';
import { normalizeSchema as normalizeBasicSchema } from '../../../utils/normalize-schema';

export const normalizeSchema = (
  schema: SnowpackBuildSchema,
  context: ExecutorContext
): NormalizedSnowpackBuildSchema => {
  const normalizedBasicSchema = normalizeBasicSchema(schema, context);

  return {
    ...schema,
    ...normalizedBasicSchema,
  };
};
