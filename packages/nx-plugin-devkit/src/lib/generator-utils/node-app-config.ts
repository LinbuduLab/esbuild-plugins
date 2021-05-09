import { joinPathFragments, TargetConfiguration } from '@nrwl/devkit';

import type { BasicNormalizedAppGenSchema } from '../shared-schema';

// 如果没有传入覆写的配置
// 则使用@nrwl/node:build/serve作为executor
// TODO: 默认使用 nx-plugin-workspace
export function createNodeAppBuildConfig<
  NormalizedAppSchema extends BasicNormalizedAppGenSchema
>(
  schema: NormalizedAppSchema,
  buildTarget?: TargetConfiguration | null
): TargetConfiguration {
  const extendBuildTarget = buildTarget ?? {
    executor: undefined,
    options: {},
    configurations: {},
  };

  return {
    executor: extendBuildTarget.executor ?? '@nrwl/node:build',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: joinPathFragments('dist', schema.projectRoot),
      main: joinPathFragments(schema.projectSourceRoot, 'main.ts'),
      tsConfig: joinPathFragments(schema.projectRoot, 'tsconfig.app.json'),
      assets: [joinPathFragments(schema.projectSourceRoot, 'assets')],
      ...extendBuildTarget.options,
    },
    configurations: {
      production: {
        optimization: true,
        extractLicenses: true,
        inspect: false,
        fileReplacements: [
          {
            replace: joinPathFragments(
              schema.projectSourceRoot,
              'environments/environment.ts'
            ),
            with: joinPathFragments(
              schema.projectSourceRoot,
              'environments/environment.prod.ts'
            ),
          },
        ],
      },
      ...extendBuildTarget.configurations,
    },
  };
}

export function createNodeAppServeConfig<
  NormalizedAppSchema extends BasicNormalizedAppGenSchema
>(
  schema: NormalizedAppSchema,
  serveTarget?: TargetConfiguration | null,
  buildTargetName?: string | null,
  prodConfigurationName?: string | null
): TargetConfiguration {
  const extendServeTarget = serveTarget ?? {
    executor: undefined,
    options: {},
    configurations: {},
  };

  const projectBuildTargetName = buildTargetName ?? 'build';
  const projectProdConfigurationName = prodConfigurationName ?? 'production';

  return {
    executor: extendServeTarget.executor ?? '@nrwl/node:execute',
    options: {
      buildTarget: `${schema.projectName}:${projectBuildTargetName}`,
      ...extendServeTarget.options,
    },
    configurations: {
      [projectProdConfigurationName]: {
        buildTarget: `${schema.projectName}:${projectBuildTargetName}:${prodConfigurationName}`,
      },
      ...extendServeTarget.configurations,
    },
  };
}
