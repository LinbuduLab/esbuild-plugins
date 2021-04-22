import {
  Tree,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  joinPathFragments,
  readProjectConfiguration,
  readWorkspaceConfiguration,
} from '@nrwl/devkit';

import type { TypeGraphQLGenSchema, NormalizedGenSchema } from '../schema';
import { getAvailableAppsOrLibs } from 'nx-plugin-devkit';

// https://github.com/2fd/graphdoc/blob/gh-pages/introspection.graphql
// CodeGen:
// URL
// Path to.graphql file

// Glob pattern
// Introspection JSON
// Code file with gql``
// JS file
// String
// GitHub
// Apollo Engine

// GenQL:
// URL
// Path to.graphql file

// GraphQLDoc
// URL
// Path to.graphql file
// JSON
// Code file with gql`` (graphql-tools)

// support schema option only for now

export function normalizeSchema(
  host: Tree,
  schema: TypeGraphQLGenSchema
): NormalizedGenSchema {
  const { app, failFast, genql, code, docs, schema: gqlSchema } = schema;
  console.log('schema: ', schema);

  // check is schema valid
  // path: check does file exists
  // url: check is url alive(use introspection.query)

  const { apps } = getAvailableAppsOrLibs(host);

  const appNames = apps.map((app) => app.appName);

  if (!appNames.includes(schema.app)) {
    throw new Error(`App ${schema.app} doesnot exist!`);
  }

  const projectName = names(schema.app).fileName;

  const { root, sourceRoot } = readProjectConfiguration(host, app);

  // TODO: get workspace root
  // const { root:ws } = readWorkspaceConfiguration(host);

  const offset = offsetFromRoot(root);

  return {
    ...schema,
    projectName,
    projectRoot: root,
    projectSourceRoot: sourceRoot,
    offsetFromRoot: offset,
  };
}
