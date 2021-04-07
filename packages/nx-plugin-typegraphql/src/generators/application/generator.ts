import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
  installPackagesTask,
  updateJson,
  GeneratorCallback,
  addDependenciesToPackageJson,
  ProjectConfiguration,
  NxJsonProjectConfiguration,
  joinPathFragments,
  TargetConfiguration,
  readWorkspaceConfiguration,
  readProjectConfiguration,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';
import { jestProjectGenerator } from '@nrwl/jest';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

import { Linter, lintProjectGenerator } from '@nrwl/linter';
import path from 'path';
import {
  Project,
  StructureKind,
  ExportDeclarationStructure,
  OptionalKind,
} from 'ts-morph';
import {
  getAvailableLibs,
  devInfo,
  devWarn,
  isValidNamespace,
  generateDTONames,
  updateDependencies,
  initializeNodeApp,
} from '../../utils';
import {
  NormalizedTypeGraphQLResolverSchema,
  TypeGraphQLApplicationSchema,
} from './schema';
import { nxVersion } from '@nrwl/node/src/utils/versions';
import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';

import resolverGenerator from '../resolver/generator';
import middlewareGenerator from '../middleware/generator';
import objectTypeGenerator from '../objecttype/generator';

function createAppBuildConfig(
  project: ProjectConfiguration,
  schema: NormalizedTypeGraphQLResolverSchema
): TargetConfiguration {
  return {
    executor: '@nrwl/node:build',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: joinPathFragments('dist', schema.appProjectRoot),
      main: joinPathFragments(project.sourceRoot, 'main.ts'),
      tsConfig: joinPathFragments(schema.appProjectRoot, 'tsconfig.app.json'),
      assets: [joinPathFragments(project.sourceRoot, 'assets')],
    },
    configurations: {
      production: {
        optimization: true,
        extractLicenses: true,
        inspect: false,
        fileReplacements: [
          {
            replace: joinPathFragments(
              project.sourceRoot,
              'environments/environment.ts'
            ),
            with: joinPathFragments(
              project.sourceRoot,
              'environments/environment.prod.ts'
            ),
          },
        ],
      },
    },
  };
}

function createAppServeConfig(
  schema: NormalizedTypeGraphQLResolverSchema
): TargetConfiguration {
  return {
    executor: '@nrwl/node:execute',
    options: {
      buildTarget: `${schema.app}:build`,
    },
  };
}

function createAppAsProject(
  host: Tree,
  schema: NormalizedTypeGraphQLResolverSchema
) {
  const project: ProjectConfiguration & NxJsonProjectConfiguration = {
    root: schema.appProjectRoot,
    sourceRoot: path.join(schema.appProjectRoot, 'src'),
    projectType: 'application',
    targets: {},
    tags: [],
  };

  project.targets.build = createAppBuildConfig(project, schema);
  project.targets.serve = createAppServeConfig(schema);

  addProjectConfiguration(host, schema.app, project);

  const workspace = readWorkspaceConfiguration(host);

  if (!workspace.defaultProject) {
    workspace.defaultProject = schema.app;
    updateWorkspaceConfiguration(host, workspace);
  }
}

function createAppFiles(
  host: Tree,
  schema: NormalizedTypeGraphQLResolverSchema
) {
  generateFiles(
    host,
    path.join(__dirname, './files/apollo'),
    schema.appProjectRoot,
    {
      tmpl: '',
      name: schema.app,
      root: schema.appProjectRoot,
      offset: offsetFromRoot(schema.appProjectRoot),
    }
  );
}

async function createAppLinter(
  host: Tree,
  schema: NormalizedTypeGraphQLResolverSchema
) {
  const lintTask = await lintProjectGenerator(host, {
    linter: Linter.EsLint,
    project: schema.app,
    tsConfigPaths: [
      joinPathFragments(schema.appProjectRoot, 'tsconfig.app.json'),
    ],
    eslintFilePatterns: [`${schema.appProjectRoot}/**/*.ts`],
    skipFormat: true,
  });

  return lintTask;
}

export default async function (
  host: Tree,
  schema: NormalizedTypeGraphQLResolverSchema
) {
  // initTask
  // addAppFiles
  // addProject
  // lint
  // unitTestRunner
  // addProxy
  // formatFiles
  // runTaskInSerial
  const normalizedSchema = normalizeSchema(host, schema);
  console.log('normalizedSchema: ', normalizedSchema);

  const tasks: GeneratorCallback[] = [];

  const initTask = await initializeNodeApp(host);
  tasks.push(initTask);

  createAppFiles(host, normalizedSchema);
  createAppAsProject(host, normalizedSchema);

  const lintTask = await createAppLinter(host, normalizedSchema);
  tasks.push(lintTask);

  const jestTask = await jestProjectGenerator(host, {
    project: normalizedSchema.app,
    // TODO: set up Apollo Testing Utils
    setupFile: 'none',
    supportTsx: true,
    babelJest: true,
    testEnvironment: 'node',
  });

  tasks.push(jestTask);

  const appConfig = readProjectConfiguration(host, normalizedSchema.name);

  // app/app1/src/app/resolvers/app1.resolver.ts
  // const resolverGeneratorTask = await resolverGenerator(host, {
  //   resolverName: normalizedSchema.app,
  //   fullImport: false,
  //   appOrLibName: normalizedSchema.app,
  //   fieldResolver: true,
  //   directory: 'app/resolvers',
  //   subscription: false,
  // });

  // tasks.push(resolverGeneratorTask);

  // // app/app1/src/app/graphql/app1.ts
  // const objectTypeGeneratorTask = await objectTypeGenerator(host, {
  //   objectTypeName: normalizedSchema.app,
  //   appOrLib: normalizedSchema.app,
  //   directory: 'app/graphql',
  //   extendInterfaceType: false,
  //   generateDTO: false,
  //   dtoHandler: 'ClassValidator',
  //   useTypeormEntityDecorator: false,
  //   extendTypeormBaseEntity: false,
  //   createLibOnInexist: false,
  // });

  // tasks.push(objectTypeGeneratorTask);

  await formatFiles(host);

  const deps = composeDepsList(normalizedSchema);
  const devDeps = composeDevDepsList(normalizedSchema);

  const installTask = addDependenciesToPackageJson(host, deps, devDeps);

  tasks.push(installTask);

  return () => {
    installPackagesTask(host);
    runTasksInSerial(...tasks);
  };
}

function composeDepsList(
  schema: NormalizedTypeGraphQLResolverSchema
): Record<string, string> {
  const basic: Record<string, string> = {
    'type-graphql': 'latest',
    graphql: 'latest',
    'reflect-metadata': 'latest',
    'apollo-server-koa': 'latest',
    koa: 'latest',
  };

  return basic;
}

function composeDevDepsList(
  schema: NormalizedTypeGraphQLResolverSchema
): Record<string, string> {
  const basic = {
    chalk: 'latest',
    'source-map-support': 'latest',
  };

  return basic;
}

function normalizeSchema(
  host: Tree,
  schema: TypeGraphQLApplicationSchema
): NormalizedTypeGraphQLResolverSchema {
  const { appsDir } = getWorkspaceLayout(host);

  // directory可以与app不一致
  // app1 dir -> apps/dir/app1 dir-app1
  // dir目录下可以存在多个app... 项目名会被注册为dir-app1的形式
  const appDirectory = schema.directory
    ? `${names(schema.directory).fileName}/${names(schema.app).fileName}`
    : names(schema.app).fileName;

  const appProjectName = appDirectory.replace(new RegExp('/', 'g'), '-');

  const appProjectRoot = joinPathFragments(appsDir, appDirectory);

  const parsedTags = schema.tags
    ? schema.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...schema,
    name: names(appProjectName).fileName,
    // frontendProject: schema.frontendProject
    //   ? names(schema.frontendProject).fileName
    //   : undefined,
    appProjectRoot,
    parsedTags,
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
  };
}
