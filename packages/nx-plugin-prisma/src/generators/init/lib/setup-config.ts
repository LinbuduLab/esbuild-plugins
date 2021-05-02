import { ProjectConfiguration, NxJsonProjectConfiguration } from '@nrwl/devkit';
import path from 'path';
import { NormalizedPrismaInitGeneratorSchema } from '../schema';

export function createInitPrismaProjectConfiguration(
  schema: NormalizedPrismaInitGeneratorSchema
): ProjectConfiguration & NxJsonProjectConfiguration {
  const project: ProjectConfiguration & NxJsonProjectConfiguration = {
    root: schema.projectRoot,
    sourceRoot: schema.projectSourceRoot,
    projectType: 'application',
    targets: {},
  };

  const cwd2SchemaRelativePath = path.relative(
    schema.projectRoot,
    schema.prismaSchemaPath
  );

  // prisma generate
  project.targets['prisma-generate'] = {
    executor: 'nx-plugin-devkit:exec',
    options: {
      command: `prisma generate --schema=${cwd2SchemaRelativePath}`,
      cwd: schema.projectRoot,
      parallel: false,
      color: true,
      envFile: schema.envFilePath,
      outputPath: schema.prismaSchemaDir,
    },
  };

  project.targets['prisma-db-push'] = {
    executor: 'nx-plugin-devkit:exec',
    options: {
      command: `prisma db push --preview-feature --schema=${cwd2SchemaRelativePath}`,
      cwd: schema.projectRoot,
      parallel: false,
      color: true,
      envFile: schema.envFilePath,
      outputPath: schema.prismaSchemaDir,
    },
  };

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
