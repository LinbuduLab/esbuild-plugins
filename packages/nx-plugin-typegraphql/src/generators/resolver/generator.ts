import {
  Tree,
  formatFiles,
  installPackagesTask,
  readProjectConfiguration,
  generateFiles,
  joinPathFragments,
  names,
} from '@nrwl/devkit';
import path from 'path';

import { TypeGraphQLResolverSchema } from './schema';
import { normalizeGenSchema } from './lib/normalize-schema';
import { appendExportToIndexFile } from './lib/append-export';

export default async function (host: Tree, schema: TypeGraphQLResolverSchema) {
  console.log('schema: ', schema);

  const normalizedSchema = normalizeGenSchema(host, schema);
  const appOrLibConfig = readProjectConfiguration(
    host,
    normalizedSchema.appOrLibName
  );

  console.log('appOrLibConfig: ', appOrLibConfig);

  const { className, fileName } = names(normalizedSchema.resolverName);

  // libs/lib1
  const appOrLibRoot = joinPathFragments(appOrLibConfig.root);
  // libs/lib1/src apps/app1/src
  const appOrLibSourceRoot = joinPathFragments(appOrLibConfig.sourceRoot);

  const resolverDirectory = joinPathFragments(
    appOrLibSourceRoot,
    normalizedSchema.directory
  );

  generateFiles(host, path.join(__dirname, './files'), resolverDirectory, {
    tmpl: '',
    Resolver: fileName,
    ...normalizedSchema,
    resolverName: className,
  });

  if (appOrLibConfig.projectType === 'library') {
    const libSourceIndexFilePath = path.join(appOrLibSourceRoot, './index.ts');
    const libSourceIndexFileContent = host
      .read(libSourceIndexFilePath)
      .toString('utf-8');

    const updatedIndexFileContent = appendExportToIndexFile(
      libSourceIndexFilePath,
      libSourceIndexFileContent,
      normalizedSchema.directory,
      fileName
    );

    host.write(libSourceIndexFilePath, updatedIndexFileContent);
  }

  await formatFiles(host);

  return () => {
    installPackagesTask(host);
  };
}
