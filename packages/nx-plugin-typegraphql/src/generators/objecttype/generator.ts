import {
  Tree,
  formatFiles,
  installPackagesTask,
  readProjectConfiguration,
  addProjectConfiguration,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
  getProjects,
  generateFiles,
  addDependenciesToPackageJson,
  getWorkspaceLayout,
  offsetFromRoot,
  normalizePath,
  applyChangesToString,
  joinPathFragments,
  names,
} from '@nrwl/devkit';

import { libraryGenerator } from '@nrwl/workspace/generators';
import {
  Project,
  StructureKind,
  ExportDeclarationStructure,
  OptionalKind,
} from 'ts-morph';
import path from 'path';
import {
  getAvailableLibs,
  devInfo,
  devWarn,
  isValidNamespace,
  generateDTONames,
} from '../../utils';
import { TypeGraphQLObjectTypeSchema } from './schema';

export default async function (
  host: Tree,
  schema: TypeGraphQLObjectTypeSchema
) {
  console.log('schema: ', schema);
  // TODO: lib name 校验也移到normalizeSchema中
  const avaliableLibs = getAvailableLibs(host);
  const libNames = avaliableLibs.map((lib) => lib.libName);

  const normalizedSchema = normalizeSchema(schema, libNames);

  if (!libNames.includes(normalizedSchema.lib)) {
    devInfo(`creating new lib: ${normalizedSchema.lib}`);
    await libraryGenerator(host, { name: normalizedSchema.lib });
  }

  const libConfig = readProjectConfiguration(host, normalizedSchema.lib);

  const { className, fileName } = names(normalizedSchema.objectTypeName);

  // libs/lib1/src
  const libSourceRoot = joinPathFragments(libConfig.sourceRoot);
  // libs/lib1/src/lib
  const libSourceLib = joinPathFragments(libConfig.sourceRoot, 'lib');
  // libs/lib1/src/lib/index.ts
  const libSourceIndexFilePath = path.join(libSourceRoot, './index.ts');

  const libSourceIndexFileContent = host
    .read(libSourceIndexFilePath)
    .toString('utf-8');

  const dtoNames = generateDTONames(className);

  generateFiles(host, path.join(__dirname, './files'), libSourceLib, {
    tmpl: '',
    ObjectType: fileName,
    componentName: className,
    interfaceName: `I${className}`,
    ...normalizedSchema,
    ...dtoNames,
  });

  const updatedIndexFileContent = appendExportToIndexFile(
    libSourceIndexFilePath,
    libSourceIndexFileContent,
    fileName,
    normalizedSchema?.namespaceExport ?? null
  );

  host.write(libSourceIndexFilePath, updatedIndexFileContent);

  await formatFiles(host);

  const deps = composeDepsList(normalizedSchema);
  const devDeps = composeDevDepsList(normalizedSchema);

  addDependenciesToPackageJson(host, deps, devDeps);

  return () => {
    installPackagesTask(host);
  };
}

function normalizeSchema(
  schema: Partial<TypeGraphQLObjectTypeSchema>,
  libNames: Array<string>
): TypeGraphQLObjectTypeSchema {
  if (!schema.objectTypeName) {
    throw new Error('ObjectType name required!');
  }

  if (!schema.lib && !libNames.includes('graphql')) {
    devInfo("lib name not specified, creating new lib 'graphql'");
    schema.lib = 'graphql';
  } else if (!schema.lib && libNames.includes('graphql')) {
    devInfo("lib name not specified and lib 'graphql' exist, use it as target");
    schema.lib = 'graphql';
  }

  if (schema.extendTypeormBaseEntity && !schema.useTypeormEntityDecorator) {
    devWarn(
      "'extendTypeormBaseEntity' option require 'useTypeormEntityDecorator' to be true, set it automatically"
    );
    schema.useTypeormEntityDecorator = true;
  }

  if (!isValidNamespace(schema.namespaceExport)) {
    devWarn(`invalid namespaceExport, got ${schema.namespaceExport}, ignore`);
    schema.namespaceExport = undefined;
  }

  return schema as TypeGraphQLObjectTypeSchema;
}

function composeDepsList(
  schema: TypeGraphQLObjectTypeSchema
): Record<string, string> {
  let basic: Record<string, string> = {
    'type-graphql': 'latest',
    graphql: 'latest',
    'reflect-metadata': 'latest',
    [schema.dtoHandler === 'ClassValidator'
      ? 'class-validator'
      : 'joi']: 'latest',
  };

  if (schema.useTypeormEntityDecorator || schema.extendTypeormBaseEntity) {
    basic = {
      ...basic,
      typeorm: 'latest',
    };
  }

  return basic;
}

function composeDevDepsList(
  schema: TypeGraphQLObjectTypeSchema
): Record<string, string> {
  const basic = {};

  return basic;
}

function appendExportToIndexFile(
  path: string,
  content: string,
  fileName: string,
  namespace?: string
): string {
  const project = new Project();
  let formattedNamespace = '';

  const sourceFile = project.createSourceFile(path, content, {
    overwrite: true,
  });

  const { className } = names(namespace);

  if (
    className.toLocaleUpperCase().indexOf('OBJECT') === -1 &&
    className.toLocaleUpperCase().indexOf('OBJECTTYPE') === -1 &&
    className.toLocaleUpperCase().indexOf('TYPE') === -1
  ) {
    formattedNamespace = `${className}Type`;
  }

  const exportDeclaration: OptionalKind<ExportDeclarationStructure> = {
    kind: StructureKind.ExportDeclaration,
    isTypeOnly: false,
    moduleSpecifier: `./lib/${fileName}`,
  };

  if (namespace) {
    exportDeclaration.namespaceExport = formattedNamespace;
  }

  sourceFile.addExportDeclaration(exportDeclaration);

  return sourceFile.getFullText();
}
