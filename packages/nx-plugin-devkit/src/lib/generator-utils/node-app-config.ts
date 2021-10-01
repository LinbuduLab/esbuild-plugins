import { joinPathFragments, TargetConfiguration } from '@nrwl/devkit';

import type { BasicNormalizedAppGenSchema } from '../schema/shared-schema';

/**
 * Compose build configuration for node project in workspace.project
 * @param schema
 * @param buildTarget
 * @returns
 */
export function createNodeAppBuildConfig<
  NormalizedAppSchema extends BasicNormalizedAppGenSchema
>(
  schema: NormalizedAppSchema,
  buildTarget?: TargetConfiguration | null
): TargetConfiguration {
  // Specify args.buildTarget to generate configuration extend from it
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
      assets: [joinPathFragments(schema.projectSourceRoot, 'assets')],
      ...extendBuildTarget.options,
    },
    // NOTE: When migarating to nx-plugin-workspace, remember to update configurations here
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

/**
 * Compose serve configuration for node project in workspace.project
 * @param schema
 * @param serveTarget
 * @param buildTargetName
 * @param prodConfigurationName
 * @returns
 */
export function createNodeAppServeConfig<
  NormalizedAppSchema extends BasicNormalizedAppGenSchema
>(
  schema: NormalizedAppSchema,
  serveTarget?: TargetConfiguration | null,
  buildTargetName?: string | null,
  prodConfigurationName?: string | null
): TargetConfiguration {
  // Specify args.serveTarget to generate configuration extend from it
  const extendServeTarget = serveTarget ?? {
    executor: undefined,
    options: {},
    configurations: {},
  };

  // Serve executor will invoke build target at first
  const projectBuildTargetName = buildTargetName ?? 'build';

  // You can also use serve executor with production configuration to check applications
  const projectProdConfigurationName = prodConfigurationName ?? 'production';

  return {
    executor: extendServeTarget.executor ?? '@nrwl/node:execute',
    options: {
      buildTarget: `${schema.projectName}:${projectBuildTargetName}`,
      ...extendServeTarget.options,
    },
    // NOTE: When migarating to nx-plugin-workspace, remember to update configurations here

    configurations: {
      [projectProdConfigurationName]: {
        buildTarget: `${schema.projectName}:${projectBuildTargetName}:${prodConfigurationName}`,
      },
      ...extendServeTarget.configurations,
    },
  };
}
