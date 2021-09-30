import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  GeneratorCallback,
  installPackagesTask,
  Tree,
} from '@nrwl/devkit';
import {
  minimalNormalizeOptions,
  minimalAddFiles,
  MinimalAppGeneratorSchema,
  minimalProjectConfiguration,
} from 'nx-plugin-devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

import path from 'path';
import { pluginSpecifiedTargets } from '../utils';

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

  minimalAddFiles(host, path.join(__dirname, './files'), normalizedOptions);

  const addDepsTask = addDependenciesToPackageJson(
    host,
    {
      react: '^17.0.0',
      'react-dom': '^17.0.0',
    },
    {
      '@types/react': '^17.0.0',
      '@types/react-dom': '^17.0.0',
      '@vitejs/plugin-react-refresh': '^1.3.1',
      typescript: '^4.3.2',
      vite: '^2.5.4',
    }
  );

  tasks.push(addDepsTask);

  await formatFiles(host);

  return () => {
    runTasksInSerial(...tasks);
    installPackagesTask(host);
  };
}
