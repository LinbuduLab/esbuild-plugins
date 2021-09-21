import { Tree, joinPathFragments } from '@nrwl/devkit';
import { updateGitIgnore, updatePrettierIgnore } from 'nx-plugin-devkit';
import { CLIENT_OUTPUT } from './constants';

import { NormalizedPrismaGeneratorSchema } from './schema-types';

export function addPrismaClientToIgnore<
  T extends NormalizedPrismaGeneratorSchema
>(host: Tree, schema: T): void {
  const prismaClientPath = joinPathFragments(
    schema.prismaSchemaDir,
    CLIENT_OUTPUT
  );
  updateGitIgnore(host, [prismaClientPath]);
  updatePrettierIgnore(host, [prismaClientPath]);
}
