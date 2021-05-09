import {
  formatFiles,
  Tree,
  installPackagesTask,
  GeneratorCallback,
  addDependenciesToPackageJson,
  joinPathFragments,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import path from 'path';
import { KoaAppGeneratorSchema } from './schema';

import { normalizeSchema } from './lib/normalize-schema';
import { composeDepsList, composeDevDepsList } from './lib/compose-deps';
import {
  createNodeInitTask,
  createNodeJestTask,
  createNodeLintTask,
  createNodeAppProject,
  createNodeAppFiles,
  setDefaultProject,
  setupProxy,
} from 'nx-plugin-devkit';

export default async function (host: Tree, schema: KoaAppGeneratorSchema) {
  const normalizedSchema = normalizeSchema(host, schema);

  const { projectName } = normalizedSchema;

  const tasks: GeneratorCallback[] = [];

  const initTask = await createNodeInitTask(host);
  tasks.push(initTask);

  // TODO: 在创建应用时，可选使用@nrwl/node作为executor或者nx-workspace
  createNodeAppProject(
    host,
    normalizedSchema,
    {
      executor: 'nx-plugin-workspace:node-build',
      options: {
        progress: true,
        verbose: true,
      },
    },
    {
      executor: 'nx-plugin-workspace:node-serve',
      options: {
        buildTarget: `${projectName}:build`,
      },
      configurations: {
        production: {
          buildTarget: `${projectName}:build:production`,
        },
      },
    }
  );

  createNodeAppFiles(host, normalizedSchema, path.join(__dirname, './files'));

  const lintTask = await createNodeLintTask(host, normalizedSchema);
  tasks.push(lintTask);

  const jestTask = await createNodeJestTask(host, normalizedSchema);
  tasks.push(jestTask);

  setDefaultProject(host, normalizedSchema);

  setupProxy(host, normalizedSchema);

  await formatFiles(host);

  const deps = composeDepsList(normalizedSchema);
  const devDeps = composeDevDepsList(normalizedSchema);

  addDependenciesToPackageJson(host, deps, devDeps);

  return () => {
    installPackagesTask(host);
    runTasksInSerial(...tasks);
  };
}
