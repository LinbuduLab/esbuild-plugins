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
import { Project, StructureKind, SourceFileStructure } from 'ts-morph';
import path from 'path';
import chalk from 'chalk';
import { TypeGraphQLObjectTypeSchema, AvaliableLib } from './schema';

export default async function (
  host: Tree,
  schema: TypeGraphQLObjectTypeSchema
) {
  console.log('schema: ', schema);
  const projects = getProjects(host);
  const libs: Array<AvaliableLib> = [];

  projects.forEach((project, libName) => {
    if (project.projectType === 'library') {
      libs.push({
        libName,
        root: project.root,
        sourceRoot: project.sourceRoot,
      });
    }
  });
  const libNames = libs.map((lib) => lib.libName);

  const normalizedSchema = normalizeSchema(schema, libNames);

  if (!libNames.includes(normalizedSchema.lib)) {
    console.log(`Create New Lib ${normalizedSchema.lib}`);
    await libraryGenerator(host, { name: normalizedSchema.lib });
  }

  const libConfig = readProjectConfiguration(host, normalizedSchema.lib);

  const { className, fileName } = names(normalizedSchema.objectTypeName);

  const libSourceRoot = joinPathFragments(libConfig.sourceRoot);
  const libSourceLib = joinPathFragments(libConfig.sourceRoot, 'lib');
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
    fileName
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
    console.log("Lib name not specified, using 'graphql'");
    schema.lib = 'graphql';
  } else if (libNames.includes('graphql')) {
    console.log("lib 'graphql' exist, use it as target");
    schema.lib = 'graphql';
  }

  if (schema.extendTypeormBaseEntity && !schema.useTypeormEntityDecorator) {
    console.warn(
      "'extendTypeormBaseEntity' option require 'useTypeormEntityDecorator' to be true, set it automatically"
    );
    schema.useTypeormEntityDecorator = true;
  }

  // const { className } = names(schema.objectTypeName);

  return schema as TypeGraphQLObjectTypeSchema;
}

function generateDTONames(className: string) {
  return {
    CreateDTOClassName: `Create${className}DTO`,
    UpdateDTOClassName: `Update${className}DTO`,
    DeleteDTOClassName: `Deleete${className}DTO`,
  };
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
  fileName: string
): string {
  const project = new Project();

  const sourceFile = project.createSourceFile(path, content, {
    overwrite: true,
  });

  sourceFile.addExportDeclaration({
    kind: StructureKind.ExportDeclaration,
    isTypeOnly: false,
    // TODO: support namespace option
    // namespaceExport: 'x',
    // namedExports: ['*'],
    moduleSpecifier: `./lib/${fileName}`,
  });

  return sourceFile.getFullText();
}
