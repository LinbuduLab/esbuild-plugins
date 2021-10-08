import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  GeneratorCallback,
  Tree,
} from '@nrwl/devkit';
import {
  minimalNormalizeOptions,
  minimalAddFiles,
  MinimalAppGeneratorSchema,
  minimalProjectConfiguration,
  installPackagesTask,
} from 'nx-plugin-devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

import path from 'path';
import { pluginSpecifiedTargets, DEPS } from '../utils';

export default async function (host: Tree, options: MinimalAppGeneratorSchema) {
  const tasks: GeneratorCallback[] = [];

  const normalizedOptions = minimalNormalizeOptions(host, {
    ...options,
    projectType: 'application',
  });

  const { projectName, projectRoot } = normalizedOptions;

  const baseProjectConfiguration =
    minimalProjectConfiguration(normalizedOptions);

  addProjectConfiguration(host, projectName, {
    ...baseProjectConfiguration,
    targets: pluginSpecifiedTargets(projectRoot),
  });

  minimalAddFiles(
    host,
    path.join(__dirname, './files'),

    normalizedOptions
  );

  const addDepsTask = addDependenciesToPackageJson(
    host,
    DEPS['dependencies'],
    DEPS['devDependencies']
  );

  tasks.push(addDepsTask);

  await formatFiles(host);

  return () => {
    runTasksInSerial(...tasks);
    installPackagesTask(host, true);
  };
}
