import {
  ProjectConfiguration,
  joinPathFragments,
  TargetConfiguration,
} from '@nrwl/devkit';

import type { BasicSchema } from './shared-schema';

export function createNodeAppBuildConfig<T extends BasicSchema>(
  project: ProjectConfiguration,
  schema: T
): TargetConfiguration {
  return {
    executor: '@nrwl/node:build',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: joinPathFragments('dist', schema.projectRoot),
      main: joinPathFragments(project.sourceRoot, 'main.ts'),
      tsConfig: joinPathFragments(schema.projectRoot, 'tsconfig.app.json'),
      assets: [joinPathFragments(project.sourceRoot, 'assets')],
    },
    configurations: {
      production: {
        optimization: true,
        extractLicenses: true,
        inspect: false,
        fileReplacements: [
          {
            replace: joinPathFragments(
              project.sourceRoot,
              'environments/environment.ts'
            ),
            with: joinPathFragments(
              project.sourceRoot,
              'environments/environment.prod.ts'
            ),
          },
        ],
      },
    },
    ...project.targets['build'],
  };
}

export function createNodeAppServeConfig<T extends BasicSchema>(
  schema: T
): TargetConfiguration {
  return {
    executor: '@nrwl/node:execute',
    options: {
      buildTarget: `${schema.projectName}:build`,
    },
  };
}
