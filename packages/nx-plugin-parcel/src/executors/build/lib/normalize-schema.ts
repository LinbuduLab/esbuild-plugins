import {
  joinPathFragments,
  normalizePath,
  ExecutorContext,
} from '@nrwl/devkit';

import { ParcelBuildSchema, NormalizedParcelBuildSchema } from '../schema';

export const normalizeSchema = (
  schema: ParcelBuildSchema,
  context: ExecutorContext
): NormalizedParcelBuildSchema => {
  const { projectName, root: workspaceRoot } = context;

  const {
    root: projectRoot,
    sourceRoot: projectSourceRoot,
  } = context.workspace.projects[projectName];

  const validSchema: Partial<ParcelBuildSchema> = {};

  // exclude undefined string type option
  for (const [k, v] of Object.entries(schema)) {
    if (typeof v !== 'undefined') {
      validSchema[k] = v;
    }
  }

  return {
    ...validSchema,
    projectName,
    projectRoot: normalizePath(projectRoot),
    projectSourceRoot: normalizePath(projectSourceRoot),
  };
};
