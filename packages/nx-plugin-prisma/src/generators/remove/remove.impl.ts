import {
  updateProjectConfiguration,
  Tree,
  readProjectConfiguration,
  joinPathFragments,
  TargetConfiguration,
  formatFiles,
} from '@nrwl/devkit';
import { PrismaRemoveGeneratorSchema } from './schema';
import { avaliablePrismaTargets } from '../utils/prisma-targets';

export default async function (
  host: Tree,
  options: PrismaRemoveGeneratorSchema
) {
  const projectConfiguration = readProjectConfiguration(host, options.app);

  const prismaSchemaDir = joinPathFragments(
    projectConfiguration.sourceRoot,
    options.prismaDirectory
  );

  const prismaSchemaPath = joinPathFragments(
    prismaSchemaDir,
    `${options.schemaName}.prisma`
  );

  if (host.exists(prismaSchemaDir)) {
    host.delete(prismaSchemaDir);
  }

  const targetsRemoved: Record<string, TargetConfiguration> = {};

  for (const [target, targetConfiguration] of Object.entries(
    projectConfiguration.targets
  )) {
    if (!avaliablePrismaTargets.includes(target)) {
      targetsRemoved[target] = targetConfiguration;
    }
  }

  updateProjectConfiguration(host, options.app, {
    ...projectConfiguration,
    targets: targetsRemoved,
  });

  await formatFiles(host);
}
