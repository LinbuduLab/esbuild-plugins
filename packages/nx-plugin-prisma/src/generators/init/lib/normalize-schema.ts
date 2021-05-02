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

  const cwd = host.root;

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

  // 似乎不需要是完整路径，apps/app1/.env 或 .env 即可
  // const envFilePath = schema.useProjectEnv
  //   ? joinPathFragments(cwd, basicNormalizedAppGenSchema.projectRoot, '.env')
  //   : joinPathFragments(cwd, '.env');

  const envFilePath = schema.useProjectEnv
    ? joinPathFragments(basicNormalizedAppGenSchema.projectRoot, '.env')
    : '.env';

  // TODO: 这个还需要特殊处理吧
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
