import {
  Tree,
  ProjectConfiguration,
  NxJsonProjectConfiguration,
  readProjectConfiguration,
} from '@nrwl/devkit';
import { NormalizedPrismaGeneratorSchema } from './schema-types';
import merge from 'lodash/merge';
import { prismaTargetsConfig } from './prisma-targets';

export function initPrismaProjectConfiguration(
  schema: NormalizedPrismaGeneratorSchema
): ProjectConfiguration & NxJsonProjectConfiguration {
  const { prismaRelatedTargets } = prismaTargetsConfig(schema);

  if (schema.noDBPull) {
    delete prismaRelatedTargets['prisma-db-pull'];
  }

  if (schema.noDBPush) {
    delete prismaRelatedTargets['prisma-db-push'];
  }

  if (schema.noMigrate) {
    delete prismaRelatedTargets['prisma-migrate-status'];
    delete prismaRelatedTargets['prisma-migrate-deploy'];
    delete prismaRelatedTargets['prisma-migrate-reset'];
  }

  if (schema.noIntrospect) {
    delete prismaRelatedTargets['prisma-introspect'];
  }

  if (schema.noStudio) {
    delete prismaRelatedTargets['prisma-studio'];
  }

  const project: ProjectConfiguration & NxJsonProjectConfiguration = {
    root: schema.projectRoot,
    sourceRoot: schema.projectSourceRoot,
    projectType: 'application',
    targets: prismaRelatedTargets,
  };

  return project;
}

export function setupPrismaProjectConfiguration(
  host: Tree,
  schema: NormalizedPrismaGeneratorSchema
): ProjectConfiguration & NxJsonProjectConfiguration {
  const { prismaRelatedTargets } = prismaTargetsConfig(schema);
  const existProjectConfiguration = readProjectConfiguration(
    host,
    schema.projectName
  );
  const project: ProjectConfiguration & NxJsonProjectConfiguration = merge(
    existProjectConfiguration,
    {
      root: schema.projectRoot,
      sourceRoot: schema.projectSourceRoot,
      projectType: 'application',
      targets: prismaRelatedTargets,
    }
  );

  return project;
}
