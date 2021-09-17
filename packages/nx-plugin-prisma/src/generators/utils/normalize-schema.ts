import { Tree, joinPathFragments } from '@nrwl/devkit';
import { normalizeNodeAppSchema, checkProjectExist } from 'nx-plugin-devkit';
import {
  PrismaGeneratorSchema,
  NormalizedPrismaGeneratorSchema,
} from './schema-types';

export function normalizeSchema(
  host: Tree,
  schema: PrismaGeneratorSchema
): NormalizedPrismaGeneratorSchema {
  if (!checkProjectExist(schema.app)) {
    throw new Error(`Project ${schema.app} does not exist!`);
  }

  const basicNormalizedAppGenSchema = normalizeNodeAppSchema(
    host,
    schema,
    false
  );

  // FIXME: client output support
  // const clientOutput = schema.clientOutput ?? './client';
  const clientOutput = schema.clientOutput ?? 'node_modules/.prisma/client';

  const prismaSchemaDir = joinPathFragments(
    basicNormalizedAppGenSchema.projectSourceRoot,
    schema.prismaDirectory
  );

  // WORKSPACE/apps/app1/src/apps/prisma/schema.prisma

  const prismaSchemaPath = joinPathFragments(
    prismaSchemaDir,
    `${schema.schemaName}.prisma`
  );

  // 似乎不需要是完整路径，apps/app1/.env 或 .env 即可
  // const envFilePath = schema.useProjectEnv
  //   ? joinPathFragments(cwd, basicNormalizedAppGenSchema.projectRoot, '.env')
  //   : joinPathFragments(cwd, '.env');

  const envFilePath = schema.useProjectEnv
    ? joinPathFragments(basicNormalizedAppGenSchema.projectRoot, '.env')
    : '.env';

  const datasourceUrl = 'env("DATABASE_URL")';

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
