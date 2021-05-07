import {
  Tree,
  ProjectConfiguration,
  NxJsonProjectConfiguration,
  readProjectConfiguration,
  joinPathFragments,
} from '@nrwl/devkit';
import { NormalizedPrismaGeneratorSchema } from './schema-types';
import merge from 'lodash/merge';
import { prismaTargetsConfig } from './prisma-targets';

export function initPrismaProjectConfiguration(
  schema: NormalizedPrismaGeneratorSchema
): ProjectConfiguration & NxJsonProjectConfiguration {
  const { prismaRelatedTargets } = prismaTargetsConfig(schema);

  console.log('schema: ', schema);

  const commonTargets = {
    build: {
      executor: 'nx-plugin-workspace:node-build',
      outputs: ['{options.outputPath}'],
      options: {
        outputPath: joinPathFragments('dist/apps', schema.projectDirectory),
        main: joinPathFragments(schema.projectSourceRoot, 'main.ts'),
        tsConfig: joinPathFragments(schema.projectRoot, 'tsconfig.app.json'),
        assets: [joinPathFragments(schema.projectSourceRoot, 'assets')],
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
      },
    },
    serve: {
      executor: 'nx-plugin-workspace:node-serve',
      options: { buildTarget: `${schema.projectName}:build` },
    },
  };

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
    // TODO: control by schema option
    targets: { ...commonTargets, ...prismaRelatedTargets },
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
