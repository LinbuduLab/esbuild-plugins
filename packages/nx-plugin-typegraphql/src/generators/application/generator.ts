import {
  formatFiles,
  Tree,
  installPackagesTask,
  GeneratorCallback,
  addDependenciesToPackageJson,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';
import path from 'path';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

import {
  createNodeInitTask,
  createNodeJestTask,
  createNodeLintTask,
  createNodeAppProject,
  createNodeAppFiles,
} from 'nx-plugin-devkit';
import { TypeGraphQLApplicationSchema } from './schema';
import { normalizeSchema } from './lib/normalize-schema';

import resolverGenerator from '../resolver/generator';
import middlewareGenerator from '../middleware/generator';
import objectTypeGenerator from '../objecttype/generator';

import { composeDepsList, composeDevDepsList } from './lib/compose-deps';

export default async function (
  host: Tree,
  schema: TypeGraphQLApplicationSchema
) {
  const normalizedSchema = normalizeSchema(host, schema);

  const tasks: GeneratorCallback[] = [];

  const initTask = await createNodeInitTask(host);
  tasks.push(initTask);

  createNodeAppProject(host, normalizedSchema);
  // TODO: real
  createNodeAppFiles(
    host,
    normalizedSchema,
    path.join(__dirname, './files/apollo-tgql')
  );

  const lintTask = await createNodeLintTask(host, normalizedSchema);
  tasks.push(lintTask);

  // TODO: setup Apollo test
  const jestTask = await createNodeJestTask(host, normalizedSchema);
  tasks.push(jestTask);

  const workspace = readWorkspaceConfiguration(host);

  if (!workspace.defaultProject) {
    workspace.defaultProject = normalizedSchema.projectRoot;
    updateWorkspaceConfiguration(host, workspace);
  }

  // const appConfig = readProjectConfiguration(host, normalizedSchema.name);

  // // app/app1/src/app/resolvers/app1.resolver.ts
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

  addDependenciesToPackageJson(host, deps, devDeps);

  const installTask = addDependenciesToPackageJson(host, deps, devDeps);

  tasks.push(installTask);

  return () => {
    installPackagesTask(host);
    runTasksInSerial(...tasks);
  };
}
