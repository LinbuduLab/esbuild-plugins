import { generateFiles, Tree } from '@nrwl/devkit';
import path from 'path';
import { createNodeAppFiles } from 'nx-plugin-devkit';
import { NormalizedPrismaGeneratorSchema } from './schema-types';
import { envContent } from './env';

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
      ClientOutput: schema.clientOutput,
      // prisma schema does not allow single quote
      DatasourceURL: schema.datasourceUrl,
      DatasourceProvider: schema.datasourceProvider,
    }
  );

  const defaultEnvDBUrl =
    schema.datasourceProvider === 'sqlite'
      ? 'file:../../db.sqlite'
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
