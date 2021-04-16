import {
  ProjectConfiguration,
  joinPathFragments,
  TargetConfiguration,
} from '@nrwl/devkit';

import { NormalizedTypeGraphQLResolverSchema } from '../schema';

export function createAppBuildConfig(
  project: ProjectConfiguration,
  schema: NormalizedTypeGraphQLResolverSchema
): TargetConfiguration {
  return {
    executor: '@nrwl/node:build',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: joinPathFragments('dist', schema.appProjectRoot),
      main: joinPathFragments(project.sourceRoot, 'main.ts'),
      tsConfig: joinPathFragments(schema.appProjectRoot, 'tsconfig.app.json'),
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
  };
}

export function createAppServeConfig(
  schema: NormalizedTypeGraphQLResolverSchema
): TargetConfiguration {
  return {
    executor: '@nrwl/node:execute',
    options: {
      buildTarget: `${schema.app}:build`,
    },
  };
}
