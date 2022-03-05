import {
  formatFiles,
  Tree,
  readProjectConfiguration,
  NxJsonProjectConfiguration,
  ProjectConfiguration,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { checkProjectExist } from 'nx-plugin-devkit';
import { pluginSpecifiedTargets } from '../utils';

export interface SetupGeneratorSchema {
  project: string;
}

export default async function (host: Tree, options: SetupGeneratorSchema) {
  const projectExists = checkProjectExist(options.project);

  if (!projectExists) {
    throw new Error(`${options.project} does not exist!`);
  }

  const currentProjectConfiguration = readProjectConfiguration(
    host,
    options.project
  );

  const updatedProjectConfiguration: ProjectConfiguration &
    NxJsonProjectConfiguration = {
    ...currentProjectConfiguration,
    targets: {
      ...currentProjectConfiguration.targets,
      ...pluginSpecifiedTargets(currentProjectConfiguration.root),
    },
  };

  updateProjectConfiguration(
    host,
    options.project,
    updatedProjectConfiguration
  );

  await formatFiles(host);
}
