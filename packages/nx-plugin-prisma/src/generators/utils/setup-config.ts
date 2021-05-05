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
