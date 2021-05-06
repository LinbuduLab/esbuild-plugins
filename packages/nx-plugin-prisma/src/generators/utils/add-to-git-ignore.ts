import { Tree, joinPathFragments } from '@nrwl/devkit';
import { updateGitIgnore } from 'nx-plugin-devkit';

import { NormalizedPrismaGeneratorSchema } from './schema-types';

export function addPrismaClientToGitIgnore<
  T extends NormalizedPrismaGeneratorSchema
>(host: Tree, schema: T): void {
  const prismaClientPath = joinPathFragments(
    schema.prismaSchemaDir,
    schema.clientOutput
  );
  updateGitIgnore(host, [prismaClientPath]);
}
