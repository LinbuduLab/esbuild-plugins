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
  getAvailableAppsOrLibs,
} from '../../utils';
import { ResolverGeneratorSchema, TypeGraphQLResolverSchema } from './schema';

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

function normalizeGenSchema(
  host: Tree,
  schema: Partial<TypeGraphQLResolverSchema>
): TypeGraphQLResolverSchema {
  const { apps, libs } = getAvailableAppsOrLibs(host);

  const appNames = apps.map((app) => app.appName);
  const libNames = libs.map((lib) => lib.libName);

  if (
    !appNames.includes(schema.appOrLibName) &&
    !libNames.includes(schema.appOrLibName)
  ) {
    throw new Error(`App or Lib ${schema.appOrLibName} dose not exist`);
  }

  if (!schema.directory) {
    schema.directory = 'resolvers';
  }

  return schema as TypeGraphQLResolverSchema;
}

// append on lib only
function appendExportToIndexFile(
  path: string,
  content: string,
  directory: string,
  fileName: string
): string {
  const project = new Project();

  const sourceFile = project.createSourceFile(path, content, {
    overwrite: true,
  });

  const exportDeclaration: OptionalKind<ExportDeclarationStructure> = {
    kind: StructureKind.ExportDeclaration,
    isTypeOnly: false,
    moduleSpecifier: `./${directory}/${fileName}.resolver`,
  };

  sourceFile.addExportDeclaration(exportDeclaration);

  return sourceFile.getFullText();
}
