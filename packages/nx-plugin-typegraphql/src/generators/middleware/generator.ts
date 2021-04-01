import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
  readProjectConfiguration,
  getProjects,
  addDependenciesToPackageJson,
  installPackagesTask,
  joinPathFragments,
} from '@nrwl/devkit';
import path from 'path';
import { libraryGenerator } from '@nrwl/workspace/generators';
import {
  MiddlewareGeneratorSchema,
  TypeGraphQLMiddlewareSchema,
} from './schema';

import {
  getAvailableAppsOrLibs,
  getAvailableLibs,
  devInfo,
  devWarn,
  isValidNamespace,
  generateDTONames,
} from '../../utils';

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

  await formatFiles(host);

  const deps = composeDepsList(normalizedSchema);
  const devDeps = composeDevDepsList(normalizedSchema);

  addDependenciesToPackageJson(host, deps, devDeps);

  return () => {
    installPackagesTask(host);
  };
}

function normalizeGenSchema(
  host: Tree,
  schema: Partial<TypeGraphQLMiddlewareSchema>
): TypeGraphQLMiddlewareSchema {
  const { apps, libs } = getAvailableAppsOrLibs(host);

  const appNames = apps.map((app) => app.appName);
  const libNames = libs.map((lib) => lib.libName);

  if (
    !appNames.includes(schema.appsOrLibs) &&
    !libNames.includes(schema.appsOrLibs)
  ) {
    throw new Error(`App or Lib ${schema.appsOrLibs} dose not exist`);
  }

  // FIXME: 如果不想作为provider，后一个问题应该根本不出现才对
  // if (!schema.asDIProvider && schema.diLibs) {
  //   devInfo('');
  // }

  if (!schema.directory) {
    schema.directory = 'middlewares';
  }

  return schema as TypeGraphQLMiddlewareSchema;
}

function composeDepsList(
  schema: TypeGraphQLMiddlewareSchema
): Record<string, string> {
  const basic: Record<string, string> = {
    'type-graphql': 'latest',
    graphql: 'latest',
    'reflect-metadata': 'latest',
    [schema.diLibs === 'TypeDI' ? 'typedi' : 'inversify']: 'latest',
  };

  return basic;
}

function composeDevDepsList(
  schema: TypeGraphQLMiddlewareSchema
): Record<string, string> {
  const basic = {};

  return basic;
}
