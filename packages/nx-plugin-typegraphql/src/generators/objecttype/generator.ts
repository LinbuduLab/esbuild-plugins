import {
  Tree,
  formatFiles,
  installPackagesTask,
  readProjectConfiguration,
  generateFiles,
  addDependenciesToPackageJson,
  names,
} from '@nrwl/devkit';

import path from 'path';
import { generateDTONames } from '../../utils';
import { TypeGraphQLObjectTypeSchema } from './schema';
import { appendExportToIndexFile } from './lib/append-export';
import { composeDepsList, composeDevDepsList } from './lib/compose-deps';
import { normalizeSchema } from './lib/normalize-schena';

export default async function (
  host: Tree,
  schema: TypeGraphQLObjectTypeSchema
) {
  const normalizedSchema = normalizeSchema(host, schema);
  // console.log('normalizedSchema: ', normalizedSchema);

  const dir = normalizedSchema.generateDirectory;
  const { className, fileName } = names(normalizedSchema.objectTypeName);

  const dtoNames = generateDTONames(className);

  const substitutions = {
    tmpl: '',
    ObjectType: fileName,
    componentName: className,
    interfaceName: `I${className}`,
    ...normalizedSchema,
    ...dtoNames,
  };

  if (normalizedSchema.generateAtApp) {
    generateFiles(host, path.join(__dirname, './files'), dir, substitutions);
  } else {
    const libConfig = readProjectConfiguration(host, normalizedSchema.appOrLib);

    const libSourceIndexFilePath = path.join(
      libConfig.sourceRoot,
      './index.ts'
    );

    const libSourceIndexFileContent = host
      .read(libSourceIndexFilePath)
      .toString('utf-8');

    generateFiles(host, path.join(__dirname, './files'), dir, substitutions);

    const updatedIndexFileContent = appendExportToIndexFile(
      libSourceIndexFilePath,
      libSourceIndexFileContent,
      fileName,
      normalizedSchema?.namespaceExport ?? null,
      normalizedSchema?.directory ?? null
    );

    host.write(libSourceIndexFilePath, updatedIndexFileContent);
  }

  await formatFiles(host);

  const deps = composeDepsList(normalizedSchema);
  const devDeps = composeDevDepsList(normalizedSchema);

  addDependenciesToPackageJson(host, deps, devDeps);

  return () => {
    installPackagesTask(host);
  };
}
