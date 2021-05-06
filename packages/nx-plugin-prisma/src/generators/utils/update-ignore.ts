import { Tree, joinPathFragments } from '@nrwl/devkit';
import { updateGitIgnore, updatePrettierIgnore } from 'nx-plugin-devkit';

import { NormalizedPrismaGeneratorSchema } from './schema-types';

export function addPrismaClientToIgnore<
  T extends NormalizedPrismaGeneratorSchema
>(host: Tree, schema: T): void {
  const prismaClientPath = joinPathFragments(
    schema.prismaSchemaDir,
    schema.clientOutput
  );
  updateGitIgnore(host, [prismaClientPath]);
  updatePrettierIgnore(host, [prismaClientPath]);
}
