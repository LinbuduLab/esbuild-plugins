import { Tree, names, getWorkspaceLayout, offsetFromRoot } from '@nrwl/devkit';
import { getAvailableAppsOrLibs } from 'nx-plugin-devkit';

import {
  KoaAppGeneratorSchema,
  NormalizedKoaAppGeneratorSchema,
} from '../schema';

export function normalizeSchema(
  host: Tree,
  schema: KoaAppGeneratorSchema
): NormalizedKoaAppGeneratorSchema {
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

  // apps/app1
  const projectRoot = `${getWorkspaceLayout(host).appsDir}/${projectDirectory}`;

  const parsedTags = schema.tags
    ? schema.tags.split(',').map((s) => s.trim())
    : [];

  const offset = offsetFromRoot(projectRoot);

  const minimal = schema.minimal ?? true;
  const routingControllerBased = schema.routingControllerBased ?? true;
  const router = schema.router ?? true;

  return {
    ...schema,
    minimal,
    routingControllerBased,
    router,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    offsetFromRoot: offset,
  };
}
