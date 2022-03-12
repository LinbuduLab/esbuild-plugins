import {
  Tree,
  ProjectConfiguration,
  NxJsonProjectConfiguration,
  readProjectConfiguration,
  TargetConfiguration,
  joinPathFragments,
} from '@nrwl/devkit';
import { NormalizedPrismaGeneratorSchema } from './schema-types';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import { prismaTargetsConfig } from './prisma-targets';

export function filterPrismaTargets(
  schema: NormalizedPrismaGeneratorSchema,
  initialConfiguration: Record<string, TargetConfiguration>
) {
  const cloned = cloneDeep(initialConfiguration);
  if (schema.noDBPull) {
    delete cloned['prisma-db-pull'];
  }

  if (schema.noDBPush) {
    delete cloned['prisma-db-push'];
  }

  if (schema.noMigrate) {
    delete cloned['prisma-migrate-status'];
    delete cloned['prisma-migrate-deploy'];
    delete cloned['prisma-migrate-reset'];
  }

  if (schema.noStudio) {
    delete cloned['prisma-studio'];
  }

  return cloned;
}

export function createAppExecTargets(
  schema: NormalizedPrismaGeneratorSchema
): Record<string, TargetConfiguration> {
  const targetsConfig: Record<string, TargetConfiguration> = {};

  for (const script of ['dev', 'build', 'start']) {
    targetsConfig[script] = {
      executor: 'nx-plugin-workspace:exec',
      options: {
        command: 'npm run dev',
        cwd: schema.projectRoot,
        parallel: false,
        color: true,
        useCamelCase: false,
        useLocalPackage: true,
        shell: true,
        ...(script === 'build'
          ? {
              outputPath: joinPathFragments(schema.projectRoot, 'dist'),
            }
          : {}),
      },
    };
  }

  return targetsConfig;
}

export function initPrismaProjectConfiguration(
  schema: NormalizedPrismaGeneratorSchema
): ProjectConfiguration & NxJsonProjectConfiguration {
  const { prismaRelatedTargets } = prismaTargetsConfig(schema);

  const projectConfiguration: ProjectConfiguration &
    NxJsonProjectConfiguration = {
    root: schema.projectRoot,
    sourceRoot: schema.projectSourceRoot,
    projectType: 'application',
    targets: {
      ...createAppExecTargets(schema),
      ...filterPrismaTargets(schema, prismaRelatedTargets),
    },
  };

  return projectConfiguration;
}

export function setupPrismaProjectConfiguration(
  host: Tree,
  schema: NormalizedPrismaGeneratorSchema
): ProjectConfiguration & NxJsonProjectConfiguration {
  const { prismaRelatedTargets } = prismaTargetsConfig(schema);

  const filteredTargets = filterPrismaTargets(schema, prismaRelatedTargets);

  const projectConfiguration = merge(
    readProjectConfiguration(host, schema.projectName),
    {
      root: schema.projectRoot,
      sourceRoot: schema.projectSourceRoot,
      projectType: 'application',
      targets: filteredTargets,
    }
  );

  return projectConfiguration;
}
