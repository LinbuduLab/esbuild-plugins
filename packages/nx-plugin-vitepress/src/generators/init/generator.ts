import {
  addProjectConfiguration,
  formatFiles,
  joinPathFragments,
  Tree,
  installPackagesTask,
  GeneratorCallback,
  addDependenciesToPackageJson,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { Linter, lintProjectGenerator } from '@nrwl/linter';
import { updateGitIgnore } from 'nx-plugin-devkit';

import { InitSchema } from './schema';
import { normalizeSchema } from './lib/normalize-schema';
import { createProjectConfiguration } from './lib/create-project';
import { createAppFiles } from './lib/create-files';
import { updateWorkspace } from './lib/workspace';

// update git ignore >> /**/node_modules/.vite
// 未来发展规划，包括生成组件等

export default async function (host: Tree, rawSchema: InitSchema) {
  const schema = normalizeSchema(host, rawSchema);
  const { projectName, projectRoot } = schema;

  const tasks: GeneratorCallback[] = [];

  const projectConfiguration = createProjectConfiguration(schema);
  addProjectConfiguration(host, projectName, projectConfiguration);

  createAppFiles(host, schema);

  if (schema.setupLint) {
    const lintTask = await lintProjectGenerator(host, {
      linter: Linter.EsLint,
      project: projectName,
      tsConfigPaths: [joinPathFragments(projectRoot, 'tsconfig.app.json')],
      eslintFilePatterns: [`${projectRoot}/**/*.ts`],
      skipFormat: true,
    });

    tasks.push(lintTask);
  }

  updateWorkspace(host, schema);

  updateGitIgnore(host, ['/**/node_modules']);

  await formatFiles(host);

  addDependenciesToPackageJson(
    host,
    {
      vitepress: '^0.13.2',
    },
    {}
  );

  return () => {
    installPackagesTask(host);
    runTasksInSerial(...tasks);
  };
}
