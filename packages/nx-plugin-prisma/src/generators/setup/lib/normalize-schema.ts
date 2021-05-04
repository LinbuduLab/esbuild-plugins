import { Tree, joinPathFragments } from '@nrwl/devkit';
import { normalizeNodeAppSchema } from 'nx-plugin-devkit';
import {
  PrismaSetupGeneratorSchema,
  NormalizedPrismaSetupGeneratorSchema,
} from '../schema';

export function normalizeSchema(
  host: Tree,
  schema: PrismaSetupGeneratorSchema
): NormalizedPrismaSetupGeneratorSchema {
  const basicNormalizedAppGenSchema = normalizeNodeAppSchema(host, schema);

  const clientOutput = schema.clientOutput ?? './client';

  const prismaSchemaDir = joinPathFragments(
    basicNormalizedAppGenSchema.projectSourceRoot,
    schema.prismaDirectory
  );

  // WORKSPACE/apps/app1/src/apps/prisma/schema.prisma

  const prismaSchemaPath = joinPathFragments(
    prismaSchemaDir,
    `${schema.schemaName}.prisma`
  );

  const envFilePath = schema.useProjectEnv
    ? joinPathFragments(basicNormalizedAppGenSchema.projectRoot, '.env')
    : '.env';

  const datasourceUrl = "env('DATABASE_URL')";

  return {
    ...schema,
    ...basicNormalizedAppGenSchema,
    prismaSchemaPath,
    envFilePath,
    datasourceUrl,
    prismaSchemaDir,
    clientProvider: 'prisma-client-js',
    clientOutput,
  };
}
