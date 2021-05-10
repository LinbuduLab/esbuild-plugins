import {
  joinPathFragments,
  normalizePath,
  ExecutorContext,
} from '@nrwl/devkit';

import { ParcelServeSchema, NormalizedParcelServeSchema } from '../schema';

export const normalizeSchema = (
  schema: ParcelServeSchema,
  context: ExecutorContext
): NormalizedParcelServeSchema => {
  const { projectName, root: workspaceRoot } = context;

  const {
    root: projectRoot,
    sourceRoot: projectSourceRoot,
  } = context.workspace.projects[projectName];

  const validSchema: Partial<ParcelServeSchema> = {};

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
