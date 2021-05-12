import { ExecutorContext } from '@nrwl/devkit';
import path from 'path';
import fs from 'fs-extra';
import { SnowpackBuildSchema, NormalizedSnowpackBuildSchema } from '../schema';

export const normalizeSchema = (
  schema: SnowpackBuildSchema,
  context: ExecutorContext
): NormalizedSnowpackBuildSchema => {
  const {
    root: workspaceRoot,
    workspace: { projects },
    projectName,
  } = context;

  const { root: projectRoot, sourceRoot: projectSourceRoot } = projects[
    projectName
  ];

  if (schema.cwd && !path.isAbsolute(schema.cwd)) {
    schema.cwd = path.resolve(workspaceRoot, schema.cwd);
  } else if (!schema.cwd) {
    schema.cwd = path.resolve(workspaceRoot, projectRoot);
  }

  if (!schema.workspaceRoot) {
    schema.workspaceRoot = workspaceRoot;
  }

  const snowpackConfigPath = path.resolve(schema.cwd, schema.configPath);

  if (!fs.existsSync(snowpackConfigPath)) {
    throw new Error(
      `snowpack config file cannot be loaded from ${snowpackConfigPath} `
    );
  }

  return {
    ...schema,
    cwd: schema.cwd,
    workspaceRoot: schema.workspaceRoot,
    projectName,
    projectRoot,
    projectSourceRoot,
  };
};
