import { joinPathFragments, TargetConfiguration } from '@nrwl/devkit';

import type { BasicNormalizedAppGenSchema } from './shared-schema';

export function createNodeAppBuildConfig<
  NormalizedAppSchema extends BasicNormalizedAppGenSchema
>(
  schema: NormalizedAppSchema,
  buildTarget: TargetConfiguration | null
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
  serveTarget: TargetConfiguration | null
): TargetConfiguration {
  const extendServeTarget = serveTarget ?? {
    executor: undefined,
    options: {},
    configurations: {},
  };

  return {
    executor: extendServeTarget.executor ?? '@nrwl/node:execute',
    options: {
      buildTarget: `${schema.projectName}:build`,
      ...extendServeTarget.options,
    },
    configurations: {
      ...extendServeTarget.configurations,
    },
  };
}
