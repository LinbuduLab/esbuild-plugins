import { normalizePath } from '@nrwl/devkit';
import path from 'path';
import { NormalizedPrismaGeneratorSchema } from './schema-types';
import merge from 'lodash/merge';

export const avaliablePrismaTargets = [
  'prisma-generate',
  'prisma-introspect',
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

  // TODO: use lodash.mergeWith
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
    },
  };

  const prismaGenerateOption = schema.collectArgs
    ? {
        options: {
          args: `--schema=${cwd2SchemaRelativePath} --watch=false`,
        },
      }
    : {
        options: {
          schema: cwd2SchemaRelativePath,
          watch: false,
        },
      };

  const prismaIntrospectOption = schema.collectArgs
    ? {
        options: {
          args: `--schema=${cwd2SchemaRelativePath} --force=false --print`,
        },
      }
    : {
        options: {
          schema: cwd2SchemaRelativePath,
          force: false,
          print: true,
        },
      };

  const prismaFormatOption = schema.collectArgs
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

  const prismaDBPullOption = schema.collectArgs
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

  const prismaDBPushOption = schema.collectArgs
    ? {
        options: {
          args: `--preview-feature --schema=${cwd2SchemaRelativePath} --skip-generate --force-reset=fasle --help=false --accept-data-loss=false`,
        },
      }
    : {
        options: {
          previewFeature: true,
          schema: cwd2SchemaRelativePath,
          skipGenerate: false,
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

  const prismaMigrateResetOption = schema.collectArgs
    ? {
        options: {
          args: `--schema=${cwd2SchemaRelativePath} --force=false --skip-generate --skip-seed`,
        },
      }
    : {
        options: {
          schema: cwd2SchemaRelativePath,
          force: false,
          skipGenerate: true,
          skipSeed: true,
        },
      };

  const prismaMigrateDeployOption = schema.collectArgs
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

  const prismaMigrateStatusOption = schema.collectArgs
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

  const prismaRelatedTargets = {
    'prisma-generate': merge(
      {
        executor: 'nx-plugin-workspace:exec',
        options: {
          command: 'prisma generate',
        },
      },
      basicPrismaTargetConfiguration,
      prismaGenerateOption
    ),
    'prisma-introspect': merge(
      {
        executor: 'nx-plugin-workspace:exec',
        options: {
          command: 'prisma introspect',
        },
      },
      basicPrismaTargetConfiguration,
      prismaIntrospectOption
    ),
    'prisma-format': merge(
      {
        executor: 'nx-plugin-workspace:exec',
        options: {
          command: 'prisma format',
        },
      },
      basicPrismaTargetConfiguration,
      prismaFormatOption
    ),
    'prisma-db-pull': merge(
      {
        executor: 'nx-plugin-workspace:exec',
        options: {
          command: 'prisma db pull',
        },
      },
      basicPrismaTargetConfiguration,
      prismaDBPullOption
    ),
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
      prismaMigrateResetOption
    ),
    'prisma-migrate-deploy': merge(
      {
        executor: 'nx-plugin-workspace:exec',
        options: {
          command: 'prisma migrate deploy',
        },
      },
      basicPrismaTargetConfiguration,
      prismaMigrateDeployOption
    ),
    'prisma-migrate-status': merge(
      {
        executor: 'nx-plugin-workspace:exec',
        options: {
          command: 'prisma migrate status',
        },
      },
      basicPrismaTargetConfiguration,
      prismaMigrateStatusOption
    ),
  };

  return {
    basicPrismaTargetConfiguration,
    prismaGenerateOption,
    prismaIntrospectOption,
    prismaFormatOption,
    prismaDBPullOption,
    prismaDBPushOption,
    prismaStudioOption,
    prismaRelatedTargets,
  };
}
