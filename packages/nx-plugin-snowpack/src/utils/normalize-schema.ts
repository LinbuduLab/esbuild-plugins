import { ExecutorContext, normalizePath } from '@nrwl/devkit';
import path from 'path';
import fs from 'fs-extra';
import { SnowpackSharedSchema } from './types';

export const normalizeSchema = <T extends SnowpackSharedSchema>(
  schema: T,
  context: ExecutorContext
) => {
  const {
    root: workspaceRoot,
    workspace: { projects },
    projectName,
  } = context;

  const { root: projectRoot, sourceRoot: projectSourceRoot } = projects[
    projectName
  ];

  let absCwd: string = '';

  // 也就是说，当作为嵌套文件夹时，必须提供cwd
  // TODO: log tips
  if (schema.root && !path.isAbsolute(schema.root)) {
    absCwd = path.resolve(workspaceRoot, schema.root);
  } else if (!schema.root) {
    absCwd = path.resolve(workspaceRoot, projectRoot);
  }

  if (!schema.workspaceRoot) {
    schema.workspaceRoot = workspaceRoot;
  }

  return {
    ...schema,
    root: schema.root,
    absCwd,
    workspaceRoot: schema.workspaceRoot,
    projectName,
    projectRoot,
    projectSourceRoot,
  };
};
