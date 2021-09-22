import {
  Tree,
  ProjectConfiguration,
  NxJsonProjectConfiguration,
  readProjectConfiguration,
  joinPathFragments,
  TargetConfiguration,
} from '@nrwl/devkit';
import { NormalizedPrismaGeneratorSchema } from './schema-types';
import merge from 'lodash/merge';
import { prismaTargetsConfig } from './prisma-targets';

export function initPrismaProjectConfiguration(
  schema: NormalizedPrismaGeneratorSchema
): ProjectConfiguration & NxJsonProjectConfiguration {
  const { prismaRelatedTargets } = prismaTargetsConfig(schema);

  const commonTargets: Record<string, TargetConfiguration> = {
    dev: {
      executor: 'nx-plugin-workspace:exec',
      options: {
        commands: [
          'rm -rf ./dist',
          'tsc --build tsconfig.app.json',
          'ncp ./src/app/prisma ./dist/app/prisma',
          'ncp db.sqlite ./dist/db.sqlite',
          'node dist/main.js',
        ],
        cwd: schema.projectRoot,
        parallel: false,
        color: true,
        useCamelCase: false,
        useLocalPackage: true,
        shell: true,
      },
    },
    build: {
      executor: 'nx-plugin-workspace:node-build',
      outputs: ['{options.outputPath}'],
      options: {
        outputPath: joinPathFragments(schema.projectDirectory, 'dist'),
        main: joinPathFragments(schema.projectSourceRoot, 'main.ts'),
        tsConfig: joinPathFragments(schema.projectRoot, 'tsconfig.app.json'),
        // TODO:
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
      configurations: {
        production: {
          buildTarget: `${schema.projectName}:build:production`,
        },
      },
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
