import { addProjectConfiguration, formatFiles, Tree } from '@nrwl/devkit';
import {
  minimalNormalizeOptions,
  minimalAddFiles,
  MinimalAppGeneratorSchema,
  minimalProjectConfiguration,
} from 'nx-plugin-devkit';
import path from 'path';
import { pluginSpecifiedTargets } from '../utils';

export default async function (host: Tree, options: MinimalAppGeneratorSchema) {
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

  await formatFiles(host);
}
