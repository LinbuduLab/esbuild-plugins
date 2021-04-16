import {
  formatFiles,
  generateFiles,
  names,
  installPackagesTask,
  readProjectConfiguration,
  addDependenciesToPackageJson,
  joinPathFragments,
  Tree,
} from '@nrwl/devkit';
import path from 'path';
import {
  Project,
  StructureKind,
  ExportDeclarationStructure,
  OptionalKind,
} from 'ts-morph';
import { getAvailableAppsOrLibs } from 'nx-plugin-devkit';

import {
  TypeGraphQLUtilSchema,
  NormalizedTypeGraphQLUtilSchema,
} from './schema';

export default async function (host: Tree, schema: TypeGraphQLUtilSchema) {
  const normalizedSchema = normalizeOptions(host, schema);
  console.log('normalizedSchema: ', normalizedSchema);
  const atApp = normalizedSchema.generateAtApp;
  const dir = normalizedSchema.generateDirectory;
  const { className, fileName } = names(normalizedSchema.name);
  const { className: typeClassName, fileName: typeFileName } = names(
    normalizedSchema.type
  );

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

function handleAppFileGeneration(
  host: Tree,
  type: string,
  name: string,
  dir: string
) {
  // Directive directive
  const { className, fileName } = names(type);

  const substitutions = {
    tmpl: '',
    [className]: name,
    name,
  };

  generateFiles(
    host,
    path.join(__dirname, `./files/${fileName}`),
    dir,
    substitutions
  );
}

function handleLibFileGeneration(
  host: Tree,
  type: string,
  name: string,
  sourceRoot: string,
  dir: string,
  exportFrom: string
) {
  const { className, fileName } = names(type);

  const substitutions = {
    tmpl: '',
    [className]: name,
    name,
  };

  const libSourceIndexFilePath = path.join(sourceRoot, './index.ts');
  const libSourceIndexFileContent = host
    .read(libSourceIndexFilePath)
    .toString('utf-8');

  generateFiles(
    host,
    path.join(__dirname, `./files/${fileName}`),
    dir,
    substitutions
  );

  const updatedIndexFileContent = appendExportToIndexFile(
    libSourceIndexFilePath,
    libSourceIndexFileContent,
    exportFrom,
    name
  );

  host.write(libSourceIndexFilePath, updatedIndexFileContent);
}

function appendExportToIndexFile(
  path: string,
  content: string,
  exportFrom: string,
  fileName: string
): string {
  const project = new Project();

  const sourceFile = project.createSourceFile(path, content, {
    overwrite: true,
  });

  // export * from "./directives/x"
  const exportDeclaration: OptionalKind<ExportDeclarationStructure> = {
    kind: StructureKind.ExportDeclaration,
    isTypeOnly: false,
    moduleSpecifier: `./${exportFrom}/${fileName}`,
  };

  sourceFile.addExportDeclaration(exportDeclaration);

  return sourceFile.getFullText();
}

function composeDepsList(
  schema: NormalizedTypeGraphQLUtilSchema
): Record<string, string> {
  let basic: Record<string, string> = {
    'type-graphql': 'latest',
    graphql: 'latest',
    'reflect-metadata': 'latest',
  };

  switch (schema.type) {
    case 'Directive':
      basic = {
        ...basic,
        'graphql-tools': 'latest',
      };
      break;
    case 'Decorator':
      break;
    case 'Plugin':
      basic = {
        ...basic,
        ['apollo-server-core']: 'latest',
        ['apollo-server-plugin-base']: 'latest',
      };
      break;
    case 'Extension':
      basic = {
        ...basic,
        ['graphql-extensions']: 'latest',
        ['apollo-server-plugin-base']: 'latest',
      };
      break;
    default:
      break;
  }

  return basic;
}

function composeDevDepsList(
  schema: NormalizedTypeGraphQLUtilSchema
): Record<string, string> {
  let basic: Record<string, string> = {};

  switch (schema.type) {
    case 'Plugin':
      basic = {
        ...basic,
        ['apollo-server-core']: 'latest',
        ['apollo-server-plugin-base']: 'latest',
      };
      break;
    case 'Directive':
    case 'Decorator':
    case 'Extension':
      break;
    default:
      break;
  }

  return basic;
}

function normalizeOptions(
  host: Tree,
  schema: TypeGraphQLUtilSchema
): NormalizedTypeGraphQLUtilSchema {
  const { apps, libs } = getAvailableAppsOrLibs(host);

  const appNames = apps.map((app) => app.appName);
  const libNames = libs.map((lib) => lib.libName);

  if (!schema.name) {
    throw new Error('ObjectType name required!');
  }

  if (
    !appNames.includes(schema.appOrLib) &&
    !libNames.includes(schema.appOrLib)
  ) {
    throw new Error(`app or lib ${schema.appOrLib} does not exist!`);
  }

  const appOrLibConfig = readProjectConfiguration(host, schema.appOrLib);

  // lib + undefined + directive >>> CREATE libs/lib1/src/directives/x.ts (UPDATE libs/lib1/src/index.ts)
  // lib + undefined + plugin >>> CREATE libs/lib1/src/plugins/x.ts (UPDATE libs/lib1/src/index.ts)
  // lib + undefined + extensions >>> CREATE libs/lib1/src/extensions/x.ts (UPDATE libs/lib1/src/index.ts)
  // lib + undefined + decorator >>> CREATE libs/lib1/src/decorators/x.ts (UPDATE libs/lib1/src/index.ts)
  // lib + undefined + scalar >>> CREATE libs/lib1/src/scalars/x.ts (UPDATE libs/lib1/src/index.ts)

  // lib + someDir + directive >>> CREATE libs/lib1/src/someDir/x.ts

  // app + undefined + directive >>> CREATE apps/app1/src/app/directives/x.ts
  // app + someDir + directive >>> CREATE apps/app1/src/app/someDir/x.ts

  // directive
  const { fileName: originFileName } = names(schema.type);
  // directives
  const dirName = `${originFileName}s`;

  const generateDirectory = joinPathFragments(
    appOrLibConfig.sourceRoot,
    appOrLibConfig.projectType === 'library'
      ? schema.directory
        ? schema.directory
        : dirName
      : schema.directory
      ? joinPathFragments('app', schema.directory)
      : 'app/directives'
  );

  return {
    ...schema,
    projectSourceRoot: appOrLibConfig.sourceRoot,
    generateDirectory,
    generateAtApp: appOrLibConfig.projectType === 'application',
  };
}
