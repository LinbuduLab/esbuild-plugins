import {
  formatFiles,
  Tree,
  installPackagesTask,
  GeneratorCallback,
  addDependenciesToPackageJson,
} from '@nrwl/devkit';
import path from 'path';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

import type { TypeGraphQLGenSchema, NormalizedGenSchema } from './schema';
import { normalizeSchema } from './lib/normalize-schema';

export default async function (host: Tree, schema: TypeGraphQLGenSchema) {
  const normalizedSchema = await normalizeSchema(host, schema);
  console.log('normalizedSchema: ', normalizedSchema);
}
