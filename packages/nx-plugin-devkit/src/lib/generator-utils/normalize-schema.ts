import { getAvailableAppsOrLibs } from '../get-avaliable-projects';
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
} from '../shared-schema';

export function normalizeNodeAppSchema<
  NormalizedAppSchema extends BasicNodeAppGenSchema
>(
  host: Tree,
  schema: NormalizedAppSchema,
  shouldThrowErrorOnAppExists?: boolean
): BasicNormalizedAppGenSchema {
  const throwErrorOnAppExists = shouldThrowErrorOnAppExists ?? true;

  const { apps } = getAvailableAppsOrLibs(host);

  const appNames = apps.map((app) => app.appName);

  if (appNames.includes(schema.app) && throwErrorOnAppExists) {
    throw new Error(`App ${schema.app} already exist!`);
  }

  const name = names(schema.app).fileName;

  // directory可以与app不一致
  // app1 dir -> apps/dir/app1 dir-app1
  // dir目录下可以存在多个app... 项目名会被注册为dir-app1的形式
  const projectDirectory = schema.directory
    ? `${names(schema.directory).fileName}/${name}`
    : name;

  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');

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
