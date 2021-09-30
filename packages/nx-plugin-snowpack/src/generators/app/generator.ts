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
      react: '^17.0.2',
      'react-dom': '^17.0.2',
    },
    {
      '@snowpack/plugin-dotenv': '^2.2.0',
      '@snowpack/plugin-react-refresh': '^2.5.0',
      '@snowpack/plugin-typescript': '^1.2.1',
      '@snowpack/web-test-runner-plugin': '^0.2.2',
      '@testing-library/react': '^12.1.0',
      '@types/chai': '^4.2.21',
      '@types/mocha': '^9.0.0',
      '@types/react': '^17.0.20',
      '@types/react-dom': '^17.0.9',
      '@types/snowpack-env': '^2.3.4',
      '@web/test-runner': '^0.13.17',
      chai: '^4.3.4',
      prettier: '^2.4.0',
      snowpack: '^3.8.8',
      typescript: '^4.4.3',
    }
  );

  tasks.push(addDepsTask);

  await formatFiles(host);

  return () => {
    runTasksInSerial(...tasks);
    installPackagesTask(host);
  };
}
