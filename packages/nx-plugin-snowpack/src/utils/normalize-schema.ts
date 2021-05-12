import { ExecutorContext } from '@nrwl/devkit';
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

  if (schema.cwd && !path.isAbsolute(schema.cwd)) {
    absCwd = path.resolve(workspaceRoot, schema.cwd);
  } else if (!schema.cwd) {
    absCwd = path.resolve(workspaceRoot, projectRoot);
  }

  if (!schema.workspaceRoot) {
    schema.workspaceRoot = workspaceRoot;
  }

  const snowpackConfigPath = path.resolve(absCwd, schema.configPath);

  if (!fs.existsSync(snowpackConfigPath)) {
    throw new Error(
      `snowpack config file cannot be loaded from ${snowpackConfigPath} `
    );
  }

  return {
    ...schema,
    cwd: schema.cwd,
    absCwd,
    workspaceRoot: schema.workspaceRoot,
    projectName,
    projectRoot,
    projectSourceRoot,
  };
};
