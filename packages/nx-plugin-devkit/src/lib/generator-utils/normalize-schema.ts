import { getAvailableApps } from '../workspace-utils/get-avaliable-projects';
import {
  getWorkspaceLayout,
  names,
  Tree,
  offsetFromRoot,
  joinPathFragments,
  normalizePath,
} from '@nrwl/devkit';

import type {
  BasicNodeAppGenSchema,
  BasicNormalizedAppGenSchema,
} from '../schema/shared-schema';

/**
 * Shared execution logic of node application executor/generator schema normalization
 * @param host
 * @param schema
 * @param shouldThrowErrorOnAppExists
 * @returns
 */
export function normalizeNodeAppSchema<
  NormalizedAppSchema extends BasicNodeAppGenSchema
>(
  host: Tree,
  schema: NormalizedAppSchema,
  shouldThrowErrorOnAppExists?: boolean
): BasicNormalizedAppGenSchema {
  const throwErrorOnAppExists = shouldThrowErrorOnAppExists ?? true;

  const apps = getAvailableApps(host);

  const appNames = apps.map((app) => app.appName);

  // When used by generator, we donot want app exist.
  // When used by executor, we donot want app to be non-existent
  if (appNames.includes(schema.app) && throwErrorOnAppExists) {
    throw new Error(`App ${schema.app} already exist!`);
  }

  const name = names(schema.app).fileName;

  // directory can be differed with app
  // e.g. app1 dir -> apps/dir/app1 dir-app1
  // there can be multiple applications under dir directory
  // project name will be registered as dir-app1 dir-app2
  const projectDirectory = schema.directory
    ? `${names(schema.directory).fileName}/${name}`
    : name;

  // dir/app -> dir-app
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');

  // apps/dir/app
  const projectRoot = normalizePath(
    `${getWorkspaceLayout(host).appsDir}/${projectDirectory}`
  );

  const projectSourceRoot = joinPathFragments(projectRoot, 'src');

  const parsedTags = schema.tags
    ? schema.tags.split(',').map((s) => s.trim())
    : [];

  const offset = offsetFromRoot(projectRoot);

  // TODO: throw error on frontend project inexist
  const frontendProject = schema.frontendProject
    ? names(schema.frontendProject).fileName
    : undefined;

  return {
    projectName,
    projectRoot,
    projectSourceRoot,
    projectDirectory,
    parsedTags,
    offsetFromRoot: offset,
    frontendProject,
  };
}
