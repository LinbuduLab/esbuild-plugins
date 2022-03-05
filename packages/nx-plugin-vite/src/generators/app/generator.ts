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
  MinimalNormalizedSchema,
  minimalProjectConfiguration,
  installPackagesTask,
} from 'nx-plugin-devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

import path from 'path';
import { pluginSpecifiedTargets, VUE_DEPS, REACT_DEPS } from '../utils';

interface ViteAppGeneratorSchema extends MinimalAppGeneratorSchema {
  framework: 'react' | 'vue';
}

interface NormalizedViteAppGeneratorSchema extends MinimalNormalizedSchema {
  framework: 'react' | 'vue';
}

export default async function (host: Tree, options: ViteAppGeneratorSchema) {
  const tasks: GeneratorCallback[] = [];

  const normalizedOptions = minimalNormalizeOptions<
    ViteAppGeneratorSchema,
    NormalizedViteAppGeneratorSchema
  >(host, {
    ...options,
    projectType: 'application',
  });

  const { projectName, projectRoot, forceInstall, framework } =
    normalizedOptions;

  const baseProjectConfiguration =
    minimalProjectConfiguration(normalizedOptions);

  addProjectConfiguration(host, projectName, {
    ...baseProjectConfiguration,
    targets: pluginSpecifiedTargets(projectRoot),
  });

  minimalAddFiles(
    host,
    path.join(__dirname, './files', framework),

    normalizedOptions
  );

  const addDepsTask = addDependenciesToPackageJson(
    host,
    (framework === 'react' ? REACT_DEPS : VUE_DEPS)['dependencies'],
    (framework === 'react' ? REACT_DEPS : VUE_DEPS)['devDependencies']
  );

  tasks.push(addDepsTask);

  await formatFiles(host);

  return () => {
    runTasksInSerial(...tasks);
    installPackagesTask(host, forceInstall);
  };
}
