import {
  getWorkspaceLayout,
  names,
  Tree,
  joinPathFragments,
} from '@nrwl/devkit';

import { Linter } from '@nrwl/linter';
import {
  NormalizedTypeGraphQLResolverSchema,
  TypeGraphQLApplicationSchema,
} from '../schema';

export function normalizeSchema(
  host: Tree,
  schema: TypeGraphQLApplicationSchema
): NormalizedTypeGraphQLResolverSchema {
  const { appsDir } = getWorkspaceLayout(host);

  // directory可以与app不一致
  // app1 dir -> apps/dir/app1 dir-app1
  // dir目录下可以存在多个app... 项目名会被注册为dir-app1的形式
  const appDirectory = schema.directory
    ? `${names(schema.directory).fileName}/${names(schema.app).fileName}`
    : names(schema.app).fileName;

  const appProjectName = appDirectory.replace(new RegExp('/', 'g'), '-');

  const appProjectRoot = joinPathFragments(appsDir, appDirectory);

  const parsedTags = schema.tags
    ? schema.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...schema,
    name: names(appProjectName).fileName,
    // frontendProject: schema.frontendProject
    //   ? names(schema.frontendProject).fileName
    //   : undefined,
    appProjectRoot,
    parsedTags,
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
  };
}
