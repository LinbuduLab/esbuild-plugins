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
  MinimalNormalizedSchema,
  installPackagesTask,
} from 'nx-plugin-devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import path from 'path';
import { pluginSpecifiedTargets, FRAMEWORK_DEPS, SHARED_DEPS } from '../utils';

interface SnowpackAppGeneratorSchema extends MinimalAppGeneratorSchema {
  framework: 'react' | 'vue' | 'svelte';
}

interface SnowpackViteAppGeneratorSchema extends MinimalNormalizedSchema {
  framework: 'react' | 'vue' | 'svelte';
}

export default async function (
  host: Tree,
  options: SnowpackAppGeneratorSchema
) {
  const tasks: GeneratorCallback[] = [];

  const normalizedOptions = minimalNormalizeOptions<
    SnowpackAppGeneratorSchema,
    SnowpackViteAppGeneratorSchema
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
    {
      ...SHARED_DEPS['dependencies'],
      ...FRAMEWORK_DEPS[framework]['dependencies'],
    },
    {
      ...SHARED_DEPS['devDependencies'],
      ...FRAMEWORK_DEPS[framework]['devDependencies'],
    }
  );

  tasks.push(addDepsTask);

  await formatFiles(host);

  return () => {
    runTasksInSerial(...tasks);
    installPackagesTask(host, forceInstall);
  };
}
