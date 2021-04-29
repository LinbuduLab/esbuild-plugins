import { Tree, joinPathFragments, GeneratorCallback } from '@nrwl/devkit';
import { jestProjectGenerator } from '@nrwl/jest';
import { Linter, lintProjectGenerator } from '@nrwl/linter';
import { initializeNodeApp } from './node-app-setup';
import type { BasicNormalizedAppGenSchema } from './shared-schema';

export async function createNodeInitTask(
  host: Tree
): Promise<GeneratorCallback> {
  return initializeNodeApp(host);
}

export async function createNodeJestTask<
  NormalizedAppSchema extends BasicNormalizedAppGenSchema
>(host: Tree, schema: NormalizedAppSchema): Promise<GeneratorCallback> {
  const jestTask = await jestProjectGenerator(host, {
    project: schema.projectName,
    setupFile: 'none',
    supportTsx: false,
    babelJest: true,
    testEnvironment: 'node',
  });

  return jestTask;
}

export async function createNodeLintTask<
  NormalizedAppSchema extends BasicNormalizedAppGenSchema
>(host: Tree, schema: NormalizedAppSchema): Promise<GeneratorCallback> {
  const lintTask = await lintProjectGenerator(host, {
    linter: Linter.EsLint,
    project: schema.projectName,
    tsConfigPaths: [joinPathFragments(schema.projectRoot, 'tsconfig.app.json')],
    eslintFilePatterns: [`${schema.projectRoot}/**/*.ts`],
    skipFormat: true,
  });
  return lintTask;
}
