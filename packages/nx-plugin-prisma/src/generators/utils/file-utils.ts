import { generateFiles, joinPathFragments, Tree } from '@nrwl/devkit';
import path from 'path';
import {
  createNodeAppFiles,
  updateGitIgnore,
  updatePrettierIgnore,
} from 'nx-plugin-devkit';
import { stripIndents } from '@nrwl/devkit';
import { CLIENT_OUTPUT } from './constants';
import { NormalizedPrismaGeneratorSchema } from './schema-types';

export function addPrismaClientToIgnore<
  T extends NormalizedPrismaGeneratorSchema
>(host: Tree, schema: T): void {
  const prismaClientPath = joinPathFragments(
    schema.prismaSchemaDir,
    CLIENT_OUTPUT
  );
  updateGitIgnore(host, [prismaClientPath]);
  updatePrettierIgnore(host, [prismaClientPath]);
}

export const envContent = (
  dbUrl: string,
  existContent?: string
) => stripIndents`
      ${existContent}

      # Environment variables declared in this file are automatically made available to Prisma.
      # See the documentation for more detail: https://pris.ly/d/prisma-schema#using-environment-variables

      # Prisma supports the native connection string format for PostgreSQL, MySQL and SQLite.
      # See the documentation for all the connection string options: https://pris.ly/d/connection-strings

      DATABASE_URL="${dbUrl}"
`;

export function createPrismaSchemaFiles(
  host: Tree,
  schema: NormalizedPrismaGeneratorSchema
) {
  // create basic files
  createNodeAppFiles(host, schema, path.join(__dirname, './files/app'), {
    SchemaName: schema.schemaName,
  });

  // create prisma schema
  generateFiles(
    host,
    path.join(
      __dirname,
      schema.initialSchema ? './files/prisma' : './files/prisma-empty'
    ),
    schema.prismaSchemaDir,
    {
      tmpl: '',
      SchemaName: schema.schemaName.trim(),
      ClientProvider: schema.clientProvider,
      // prisma schema does not allow single quote
      DatasourceURL: schema.datasourceUrl,
      DatasourceProvider: schema.datasourceProvider,
    }
  );

  const defaultEnvDBUrl =
    schema.datasourceProvider === 'sqlite'
      ? 'file:../../../db.sqlite'
      : 'SET_DATABASE_URL_HERE';

  const envPath = path.join(
    schema.useProjectEnv ? schema.projectRoot : '',
    '.env'
  );

  // create .env file(generateFiles will ignore .env__tmpl__?)
  if (host.exists(envPath)) {
    console.log(`${envPath} exists, will merge new content inside.`);
    host.write(
      envPath,
      envContent(defaultEnvDBUrl, host.read(envPath).toString())
    );
  } else {
    host.write(envPath, envContent(defaultEnvDBUrl));
  }
}
