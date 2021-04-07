import fs from 'fs/promises';
import path from 'path';
import { inspect } from 'util';
import type { Plugin } from 'esbuild';
import {
  ParsedCommandLine,
  transpileModule,
  findConfigFile,
  sys,
  parseConfigFileTextToJson,
  parseJsonConfigFileContent,
} from 'typescript';
import dotenv from 'dotenv';

import { ExecutorContext } from '@nrwl/devkit';

import { createProjectGraph } from '@nrwl/workspace/src/core/project-graph';
import {
  calculateProjectDependencies,
  checkDependentProjectsHaveBeenBuilt,
  createTmpTsConfig,
} from '@nrwl/workspace/src/utilities/buildable-libs-utils';
import { runWebpack } from '@nrwl/workspace/src/utilities/run-webpack';
// import * as webpack from 'webpack';

import { map, tap } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';

import { ESBuildExecutorSchema } from './schema';

dotenv.config();

export type NodeBuildEvent = {
  outfile: string;
  success: boolean;
};

export async function buildExecutor(
  rawOptions: ESBuildExecutorSchema,
  context: ExecutorContext
) {
  console.log('rawOptions: ', rawOptions);
  console.log('context: ', context);

  // 不用指定而是自己查找
  const { sourceRoot, root } = context.workspace.projects[context.projectName];

  if (!sourceRoot) {
    throw new Error(`${context.projectName} does not have a sourceRoot.`);
  }

  if (!root) {
    throw new Error(`${context.projectName} does not have a root.`);
  }

  return {
    success: true,
  };
}
