import {
  formatFiles,
  names,
  installPackagesTask,
  addDependenciesToPackageJson,
  Tree,
} from '@nrwl/devkit';

import { TypeGraphQLUtilSchema } from './schema';
import { normalizeSchema } from './lib/normalize-schema';
import { composeDepsList, composeDevDepsList } from './lib/compose-deps';
import {
  handleAppFileGeneration,
  handleLibFileGeneration,
} from './lib/generate-file';

export default async function (host: Tree, schema: TypeGraphQLUtilSchema) {
  const normalizedSchema = normalizeSchema(host, schema);
  const atApp = normalizedSchema.generateAtApp;
  const dir = normalizedSchema.generateDirectory;

  const { fileName: typeFileName } = names(normalizedSchema.type);

  atApp
    ? handleAppFileGeneration(
        host,
        normalizedSchema.type,
        normalizedSchema.name,
        dir
      )
    : handleLibFileGeneration(
        host,
        normalizedSchema.type,
        normalizedSchema.name,
        normalizedSchema.projectSourceRoot,
        dir,
        normalizedSchema.directory
          ? normalizedSchema.directory
          : `${typeFileName}s`
      );

  await formatFiles(host);

  const deps = composeDepsList(normalizedSchema);
  const devDeps = composeDevDepsList(normalizedSchema);

  addDependenciesToPackageJson(host, deps, devDeps);

  return () => {
    installPackagesTask(host);
  };
}
