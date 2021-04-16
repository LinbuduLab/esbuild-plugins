import {
  formatFiles,
  Tree,
  installPackagesTask,
  GeneratorCallback,
  addDependenciesToPackageJson,
  readProjectConfiguration,
} from '@nrwl/devkit';
import { jestProjectGenerator } from '@nrwl/jest';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

import { initializeNodeApp } from 'nx-plugin-devkit';
import { NormalizedTypeGraphQLResolverSchema } from './schema';
import { normalizeSchema } from './lib/normalize-schema';

// import resolverGenerator from '../resolver/generator';
// import middlewareGenerator from '../middleware/generator';
// import objectTypeGenerator from '../objecttype/generator';

import {
  createAppAsProject,
  createAppFiles,
  createAppLinter,
} from './lib/setup-app';
import { composeDepsList, composeDevDepsList } from './lib/compose-deps';

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

  addDependenciesToPackageJson(host, deps, devDeps);

  // const installTask = addDependenciesToPackageJson(host, deps, devDeps);

  // tasks.push(installTask);

  return () => {
    installPackagesTask(host);
    runTasksInSerial(...tasks);
  };
}
