import { generateFiles, Tree } from '@nrwl/devkit';
import path from 'path';
import { createNodeAppFiles } from 'nx-plugin-devkit';
import { NormalizedPrismaInitGeneratorSchema } from '../schema';
import { envContent } from './env';

export function initPrismaFiles(
  host: Tree,
  schema: NormalizedPrismaInitGeneratorSchema
) {
  createNodeAppFiles(host, schema, path.join(__dirname, '../files/app'), {
    SchemaName: schema.schemaName,
  });

  generateFiles(
    host,
    path.join(__dirname, '../files/prisma'),
    schema.prismaSchemaDir,
    {
      tmpl: '',
      SchemaName: schema.schemaName,
      ClientProvider: schema.clientProvider,
      ClientOutput: schema.clientOutput,
      // prisma schema does not allow single quote
      DatasourceURL: schema.datasourceUrl.replaceAll("'", '"'),
      DatasourceProvider: schema.datasourceProvider,
    }
  );

  const defaultEnvDBUrl =
    schema.datasourceProvider === 'sqlite'
      ? 'file:../../db.sqlite'
      : 'SET_DATABASE_URL_HERE';

  host.write(
    path.join(schema.useProjectEnv && schema.projectRoot, '.env'),
    envContent(defaultEnvDBUrl)
  );
}
