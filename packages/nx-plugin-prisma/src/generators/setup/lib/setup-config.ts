import {
  ProjectConfiguration,
  NxJsonProjectConfiguration,
  normalizePath,
} from '@nrwl/devkit';
import path from 'path';
import { NormalizedPrismaSetupGeneratorSchema } from '../schema';
import merge from 'lodash/merge';

export function createInitPrismaProjectConfiguration(
  schema: NormalizedPrismaSetupGeneratorSchema
): ProjectConfiguration & NxJsonProjectConfiguration {
  const project: ProjectConfiguration & NxJsonProjectConfiguration = {
    root: schema.projectRoot,
    sourceRoot: schema.projectSourceRoot,
    projectType: 'application',
    targets: {},
  };

  const cwd2SchemaRelativePath = normalizePath(
    path.relative(schema.projectRoot, schema.prismaSchemaPath)
  );

  const basicPrismaTargetConfiguration = {
    // FIXME: executor option position
    executor: 'nx-plugin-workspace:exec',
    options: {
      cwd: schema.projectRoot,
      parallel: false,
      color: true,
      envFile: schema.envFilePath,
      outputPath: schema.prismaSchemaDir,
      useCamelCase: false,
    },
  };

  const schemaOption = schema.collectArgs
    ? {
        options: {
          args: `--schema=${cwd2SchemaRelativePath}`,
        },
      }
    : {
        options: {
          schema: cwd2SchemaRelativePath,
        },
      };

  const previewFeatureOption = schema.collectArgs
    ? {
        options: {
          args: `--preview-feature --schema=${cwd2SchemaRelativePath}`,
        },
      }
    : {
        options: {
          previewFeature: true,
          schema: cwd2SchemaRelativePath,
        },
      };

  // prisma generate
  project.targets['prisma-generate'] = merge(
    {
      executor: 'nx-plugin-workspace:exec',
      options: {
        command: 'prisma generate',
      },
    },
    basicPrismaTargetConfiguration,
    schemaOption
  );

  project.targets['prisma-format'] = merge(
    {
      executor: 'nx-plugin-workspace:exec',
      options: {
        command: 'prisma format',
      },
    },
    basicPrismaTargetConfiguration,
    schemaOption
  );

  project.targets['prisma-db-pull'] = merge(
    {
      executor: 'nx-plugin-workspace:exec',
      options: {
        command: 'prisma db push',
      },
    },
    basicPrismaTargetConfiguration,
    previewFeatureOption
  );

  project.targets['prisma-db-push'] = merge(
    {
      executor: 'nx-plugin-workspace:exec',
      options: {
        command: 'prisma db push',
      },
    },
    basicPrismaTargetConfiguration,
    previewFeatureOption
  );

  project.targets['prisma-studio'] = merge(
    {
      executor: 'nx-plugin-workspace:exec',
      options: {
        command: 'prisma studio',
      },
    },
    basicPrismaTargetConfiguration,
    schema.collectArgs
      ? {
          options: {
            args: `--browser=chrome --port=7777 --schema=${cwd2SchemaRelativePath}`,
          },
        }
      : {
          options: {
            schema: cwd2SchemaRelativePath,
            browser: 'chrome',
            port: 7777,
          },
        }
  );

  // FIXME: Build Error
  project.targets['build'] = {
    executor: '@nrwl/node:build',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: `dist/${schema.projectRoot}`,
      main: `${schema.projectRoot}/src/main.ts`,
      tsConfig: `${schema.projectRoot}/tsconfig.app.json`,
      assets: [`${schema.projectRoot}/src/assets`],
      progress: true,
      verbose: true,
    },
  };

  project.targets['serve'] = {
    executor: '@nrwl/node:execute',
    options: { buildTarget: `${schema.projectName}:build` },
    configurations: {},
  };

  return project;
}
