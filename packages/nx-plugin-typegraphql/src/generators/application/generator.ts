import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
  updateJson,
  GeneratorCallback,
  addDependenciesToPackageJson,
  ProjectConfiguration,
  NxJsonProjectConfiguration,
  joinPathFragments,
  TargetConfiguration,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';
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
} from '../../utils';
import {
  ApplicationGeneratorSchema,
  TypeGraphQLApplicationSchema,
} from './schema';
import { nxVersion } from '@nrwl/node/src/utils/versions';
import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';
import ResolverGenerator from '../resolver/generator';
import MiddlewareGenerator from '../middleware/generator';
import ObjectTypeGenerator from '../objecttype/generator';

function updateDependencies(host: Tree) {
  updateJson(host, 'package.json', (json) => {
    delete json.dependencies['@nrwl/node'];
    return json;
  });

  return addDependenciesToPackageJson(host, {}, { '@nrwl/node': nxVersion });
}

async function initialize(host: Tree, schema: TypeGraphQLApplicationSchema) {
  setDefaultCollection(host, '@nrwl/node');

  const initInstallTask = updateDependencies(host);
  return async () => {
    await initInstallTask();
  };
}

// function generateAppMainFiles(host: Tree, schema: TypeGraphQLApplicationSchema) {
//    generateFiles(host, path.join(__dirname, './files/app'), schema.appProjectRoot, {
//      tmpl: '',
//      name: schema.name,
//      root: schema.appProjectRoot,
//      offset: offsetFromRoot(schema.appProjectRoot),
//    });
// }

function createAppBuildConfig(
  project: ProjectConfiguration,
  schema: TypeGraphQLApplicationSchema
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
  schema: TypeGraphQLApplicationSchema
): TargetConfiguration {
  return {
    executor: '@nrwl/node:execute',
    options: {
      buildTarget: `${schema.app}:build`,
    },
  };
}

function createAppAsProject(host: Tree, schema: TypeGraphQLApplicationSchema) {
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

function createAppFiles(host: Tree, schema: TypeGraphQLApplicationSchema) {
  generateFiles(
    host,
    path.join(__dirname, './files/app'),
    schema.appProjectRoot,
    {
      tmpl: '',
      name: schema.app,
      root: schema.appProjectRoot,
      offset: offsetFromRoot(schema.appProjectRoot),
    }
  );
}

export default async function (
  host: Tree,
  schema: TypeGraphQLApplicationSchema
) {
  // initTask
  // addAppFiles
  // addProject
  // lint
  // unitTestRunner
  // addProxy
  // formatFiles
  // runTaskInSerial
  console.log('schema: ', schema);
  const normalizedSchema = normalizeSchema(host, schema);

  const tasks: GeneratorCallback[] = [];

  const initTask = await initialize(host, normalizedSchema);
}

function normalizeSchema(host: Tree, schema: TypeGraphQLApplicationSchema) {
  const { appsDir } = getWorkspaceLayout(host);

  // directory可以与app不一致
  // app1 dir -> apps/dir/app1
  // dir目录下可以存在多个app... 项目名会被注册为dir-app1的形式
  const appDirectory = schema.directory
    ? `${names(schema.directory).fileName}/${names(schema.app).fileName}`
    : names(schema.app).fileName;

  const appProjectName = appDirectory.replace(new RegExp('/', 'g'), '-');

  const appProjectRoot = joinPathFragments(appsDir, appDirectory);

  const parsedTags = [];
  // const parsedTags = schema.tags
  //   ? schema.tags.split(',').map((s) => s.trim())
  //   : [];

  return {
    ...schema,
    name: names(appProjectName).fileName,
    // frontendProject: schema.frontendProject
    //   ? names(schema.frontendProject).fileName
    //   : undefined,
    appProjectRoot,
    parsedTags,
    // linter: schema.linter ?? Linter.EsLint,
    // unitTestRunner: schema.unitTestRunner ?? 'jest',
  };
}
