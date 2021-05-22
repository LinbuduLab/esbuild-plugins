import {
  names,
  offsetFromRoot,
  joinPathFragments,
  getWorkspaceLayout,
  Tree,
  normalizePath,
} from '@nrwl/devkit';
import { getAvailableAppsOrLibs } from 'nx-plugin-devkit';

import { InitSchema, NormalizedInitSchema } from '../schema';

export function normalizeSchema(
  host: Tree,
  schema: InitSchema
): NormalizedInitSchema {
  const { apps } = getAvailableAppsOrLibs(host);

  const appNames = apps.map((app) => app.appName);

  if (appNames.includes(schema.app)) {
    throw new Error(`App ${schema.app} already exist!`);
  }

  const name = names(schema.app).fileName;

  const projectDirectory = schema.directory
    ? `${names(schema.directory).fileName}/${name}`
    : name;

  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');

  const projectRoot = normalizePath(
    `${getWorkspaceLayout(host).appsDir}/${projectDirectory}`
  );

  const parsedTags = schema.tags
    ? schema.tags.split(',').map((s) => s.trim())
    : [];

  // will not be used but required in some checks
  const projectSourceRoot = joinPathFragments(projectRoot, 'src');

  return {
    ...schema,
    projectName,
    projectRoot,
    projectSourceRoot,
    projectDirectory,
    parsedTags,
    offsetFromRoot: offsetFromRoot(projectRoot),
  };
}
