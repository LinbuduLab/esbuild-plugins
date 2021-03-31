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
  const sourceRoot = joinPathFragments(appOrLibConfig.sourceRoot);

  // Todo: check directory exist? or create on inexist
  const middlewareDirectory = joinPathFragments(
    appOrLibRoot,
    normalizedSchema.directory
  );

  generateFiles(host, path.join(__dirname, './files'), middlewareDirectory, {
    tmpl: '',
    Middleware: fileName,
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

// interface NormalizedSchema extends MiddlewareGeneratorSchema {
//   projectName: string;
//   projectRoot: string;
//   projectDirectory: string;
//   parsedTags: string[];
// }

// function normalizeOptions(
//   host: Tree,
//   options: MiddlewareGeneratorSchema
// ): NormalizedSchema {
//   const name = names(options.name).fileName;
//   const projectDirectory = options.directory
//     ? `${names(options.directory).fileName}/${name}`
//     : name;
//   const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
//   const projectRoot = `${getWorkspaceLayout(host).libsDir}/${projectDirectory}`;
//   const parsedTags = options.tags
//     ? options.tags.split(',').map((s) => s.trim())
//     : [];

//   return {
//     ...options,
//     projectName,
//     projectRoot,
//     projectDirectory,
//     parsedTags,
//   };
// }

// function addFiles(host: Tree, options: NormalizedSchema) {
//   const templateOptions = {
//     ...options,
//     ...names(options.name),
//     offsetFromRoot: offsetFromRoot(options.projectRoot),
//     template: '',
//   };
//   generateFiles(
//     host,
//     path.join(__dirname, 'files'),
//     options.projectRoot,
//     templateOptions
//   );
// }

// export default async function (host: Tree, options: MiddlewareGeneratorSchema) {
//   const normalizedOptions = normalizeOptions(host, options);
//   addProjectConfiguration(host, normalizedOptions.projectName, {
//     root: normalizedOptions.projectRoot,
//     projectType: 'library',
//     sourceRoot: `${normalizedOptions.projectRoot}/src`,
//     targets: {
//       build: {
//         executor: '@penumbra/middleware:build',
//       },
//     },
//     tags: normalizedOptions.parsedTags,
//   });
//   addFiles(host, normalizedOptions);
//   await formatFiles(host);
// }
