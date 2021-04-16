import {
  formatFiles,
  generateFiles,
  names,
  Tree,
  readProjectConfiguration,
  addDependenciesToPackageJson,
  installPackagesTask,
  joinPathFragments,
} from '@nrwl/devkit';
import path from 'path';
import { TypeGraphQLMiddlewareSchema } from './schema';

import { normalizeGenSchema } from './lib/normalize-schema';
import { composeDepsList, composeDevDepsList } from './lib/compose-deps';
import { appendExportToIndexFile } from './lib/append-export';

// appOrLibs: app1 -> apps/app1, 不会自动创建, lib1 -> libs/lib1，也不会自动创建？
// 还是新增一个指定生成到app or lib 的选项？
// directory: middlewares(默认为middlewares) -> apps/app1/middlewares
//

export default async function (
  host: Tree,
  schema: TypeGraphQLMiddlewareSchema
) {
  console.log('schema: ', schema);

  const normalizedSchema = normalizeGenSchema(host, schema);
  const appOrLibConfig = readProjectConfiguration(
    host,
    normalizedSchema.appsOrLibs
  );

  const { className, fileName } = names(normalizedSchema.middlewareName);

  // libs/lib1
  const appOrLibRoot = joinPathFragments(appOrLibConfig.root);
  // libs/lib1/src
  const appOrLibSourceRoot = joinPathFragments(appOrLibConfig.sourceRoot);

  // Todo: check directory exist? or create on inexist
  const middlewareDirectory = joinPathFragments(
    appOrLibSourceRoot,
    normalizedSchema.directory
  );

  generateFiles(host, path.join(__dirname, './files'), middlewareDirectory, {
    tmpl: '',
    Middleware: fileName,
    camelCaseMiddlewareName: className,
    ...normalizedSchema,
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

  const deps = composeDepsList(normalizedSchema);
  const devDeps = composeDevDepsList(normalizedSchema);

  addDependenciesToPackageJson(host, deps, devDeps);

  return () => {
    installPackagesTask(host);
  };
}
