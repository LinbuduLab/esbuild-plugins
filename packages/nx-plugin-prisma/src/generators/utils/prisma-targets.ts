import { normalizePath } from '@nrwl/devkit';
import path from 'path';
import { NormalizedPrismaGeneratorSchema } from './schema-types';
import merge from 'lodash/merge';

export const avaliablePrismaTargets = [
  'prisma-generate',
  'prisma-format',
  'prisma-studio',
  'prisma-db-pull',
  'prisma-db-push',
  'prisma-migrate-reset',
  'prisma-migrate-deploy',
  'prisma-migrate-status',
];

export function prismaTargetsConfig(schema: NormalizedPrismaGeneratorSchema) {
  const cwd2SchemaRelativePath = normalizePath(
    path.relative(schema.projectRoot, schema.prismaSchemaPath)
  );

  const basicPrismaTargetConfiguration = {
    executor: 'nx-plugin-workspace:exec',
    options: {
      cwd: schema.projectRoot,
      parallel: false,
      color: true,
      envFile: schema.envFilePath,
      outputPath: schema.prismaSchemaDir,
      useCamelCase: false,
      useLocalPackage: true,
      shell: true,
      ignoreFalsy: true,
    },
  };

  const sharedPrismaOptions = schema.collectArgs
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

  const prismaDBPushOption = schema.collectArgs
    ? {
        options: {
          args: `--schema=${cwd2SchemaRelativePath} --force-reset=false --accept-data-loss=false`,
        },
      }
    : {
        options: {
          schema: cwd2SchemaRelativePath,
          forceReset: false,
          acceptDataLoss: false,
        },
      };

  const prismaStudioOption = schema.collectArgs
    ? {
        options: {
          args: `--schema=${cwd2SchemaRelativePath} --browser=chrome --port=7777`,
        },
      }
    : {
        options: {
          schema: cwd2SchemaRelativePath,
          browser: 'chrome',
          port: 7777,
        },
      };

  const prismaRelatedTargets = {
    'prisma-db-push': merge(
      {
        executor: 'nx-plugin-workspace:exec',
        options: {
          command: 'prisma db push',
        },
      },
      basicPrismaTargetConfiguration,
      prismaDBPushOption
    ),
    'prisma-db-pull': merge(
      {
        executor: 'nx-plugin-workspace:exec',
        options: {
          command: 'prisma db pull',
        },
      },
      basicPrismaTargetConfiguration,
      sharedPrismaOptions
    ),
    'prisma-generate': merge(
      {
        executor: 'nx-plugin-workspace:exec',
        options: {
          command: 'prisma generate',
        },
      },
      basicPrismaTargetConfiguration,
      sharedPrismaOptions
    ),
    'prisma-format': merge(
      {
        executor: 'nx-plugin-workspace:exec',
        options: {
          command: 'prisma format',
        },
      },
      basicPrismaTargetConfiguration,
      sharedPrismaOptions
    ),

    'prisma-studio': merge(
      {
        executor: 'nx-plugin-workspace:exec',
        options: {
          command: 'prisma studio',
        },
      },
      basicPrismaTargetConfiguration,
      prismaStudioOption
    ),
    'prisma-migrate-reset': merge(
      {
        executor: 'nx-plugin-workspace:exec',
        options: {
          command: 'prisma migrate reset',
        },
      },
      basicPrismaTargetConfiguration,
      sharedPrismaOptions
    ),
    'prisma-migrate-deploy': merge(
      {
        executor: 'nx-plugin-workspace:exec',
        options: {
          command: 'prisma migrate deploy',
        },
      },
      basicPrismaTargetConfiguration,
      sharedPrismaOptions
    ),
    'prisma-migrate-status': merge(
      {
        executor: 'nx-plugin-workspace:exec',
        options: {
          command: 'prisma migrate status',
        },
      },
      basicPrismaTargetConfiguration,
      sharedPrismaOptions
    ),
    info: merge({
      executor: 'nx-plugin-prisma:info',
      options: {},
    }),
  };

  return {
    basicPrismaTargetConfiguration,
    prismaRelatedTargets,
  };
}
