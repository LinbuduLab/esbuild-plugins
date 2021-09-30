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
import path from 'path';
import fs from 'fs-extra';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { pluginSpecifiedTargets } from './targets';

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

  fs.ensureFileSync(path.resolve(projectRoot, '.env'));

  fs.writeFileSync(
    path.resolve(projectRoot, '.env'),
    'SKIP_PREFLIGHT_CHECK=true\n'
  );

  const addDepsTask = addDependenciesToPackageJson(
    host,
    // follow original CRA deps structure
    {
      '@testing-library/jest-dom': '^5.11.4',
      '@testing-library/react': '^11.1.0',
      '@testing-library/user-event': '^12.1.10',
      '@types/jest': '^26.0.15',
      '@types/node': '^12.0.0',
      '@types/react': '^17.0.0',
      '@types/react-dom': '^17.0.0',
      react: '^17.0.2',
      'react-dom': '^17.0.2',
      'react-scripts': '4.0.3',
      typescript: '^4.1.2',
      'web-vitals': '^1.0.1',
    },
    {}
  );

  tasks.push(addDepsTask);

  await formatFiles(host);

  return () => {
    runTasksInSerial(...tasks);
    installPackagesTask(host);
  };
}
