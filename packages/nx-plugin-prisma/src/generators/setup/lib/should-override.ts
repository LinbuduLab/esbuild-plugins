import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import { NormalizedPrismaSetupGeneratorSchema } from '../schema';

export function shouldOverrideExistPrismaTargets(
  host: Tree,
  schema: NormalizedPrismaSetupGeneratorSchema
) {
  const projectConfiguration = readProjectConfiguration(
    host,
    schema.projectName
  );

  const projectTargets = Object.keys(projectConfiguration.targets);
  const hasPrismaRelatedTargets = projectTargets.some((target) =>
    target.includes('prisma')
  );

  const prismaSchemaExists = host.exists(schema.prismaSchemaPath);

  const isAlreadyPrismaSetup = hasPrismaRelatedTargets || prismaSchemaExists;

  if (isAlreadyPrismaSetup && !schema.override) {
    throw new Error(
      "This project contains Prisma Client / Prisma Related Targsts already, set 'override' to be true to execute."
    );
  }

  if (isAlreadyPrismaSetup && schema.override) {
    console.warn("You're overriding exist prisma project");
  }
}
