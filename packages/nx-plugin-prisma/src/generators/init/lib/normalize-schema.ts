import { Tree, joinPathFragments, getWorkspaceLayout } from '@nrwl/devkit';
import { normalizeNodeAppSchema } from 'nx-plugin-devkit';
import path from 'path';
import fs from 'fs-extra';
import {
  PrismaInitGeneratorSchema,
  PrismaInitGeneratorExtraSchema,
  NormalizedPrismaInitGeneratorSchema,
} from '../schema';
// schema:  {
//   app: 'nest-app',
//   'prisma-directory': 'apps/prisma',
//   'schema-name': 'schema',
//   'datasource-provider': 'sqlite',
//   'use-project-env': true,
//   'client-provider': 'prisma-client-js',
//   watch: false,
//   'initial-schema': true
// }
// basicNormalizedAppGenSchema:  {
//   projectName: 'nest-app',
//   projectRoot: 'apps/nest-app',
//   projectSourceRoot: 'apps/nest-app/src',
//   projectDirectory: 'nest-app',
//   parsedTags: [],
//   offsetFromRoot: '../../',
//   frontendProject: undefined
// }
export function normalizeSchema(
  host: Tree,
  schema: PrismaInitGeneratorSchema
): NormalizedPrismaInitGeneratorSchema {
  console.log('schema: ', schema);
  const basicNormalizedAppGenSchema = normalizeNodeAppSchema(
    host,
    schema,
    false
  );
  console.log('basicNormalizedAppGenSchema: ', basicNormalizedAppGenSchema);

  const cwd = process.cwd();
  // WORKSPACE/apps/app1/src/apps/prisma/schema.prisma
  const prismaSchemaPath = joinPathFragments(
    cwd,
    basicNormalizedAppGenSchema.projectSourceRoot,
    schema.prismaDirectory,
    `${schema.schemaName}.prisma`
  );

  const envFilePath = schema.useProjectEnv
    ? joinPathFragments(cwd, basicNormalizedAppGenSchema.projectRoot, '.env')
    : joinPathFragments(cwd, '.env');

  // TODO: 这个还需要特殊处理吧
  const datasourceUrl = "env('DATABASE_URL')";

  if (
    schema.clientProvider !== 'prisma-client-js' &&
    !schema.clientProvider.startsWith('.')
  ) {
    throw new Error(
      `Prisma client provider supports only 'prisma-client-js' or relative path, received ${schema.clientProvider}`
    );
  }
  return {
    ...schema,
    ...basicNormalizedAppGenSchema,
    prismaSchemaPath,
    envFilePath,
    datasourceUrl,
  };
}
