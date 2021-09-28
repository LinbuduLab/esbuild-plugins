import type { ExecutorContext } from '@nrwl/devkit';
import type { ViteBuildSchema } from './schema';

import path from 'path';

import { eachValueFrom } from 'rxjs-for-await';
import { map } from 'rxjs/operators';

import { startViteBuild } from './lib/vite-build';
import { preflightCheck } from '../utils/preflight-check';

export default function runExecutor(
  schema: ViteBuildSchema,
  context: ExecutorContext
) {
  preflightCheck(context, schema.configFile);

  schema.root =
    schema.root ?? context.workspace.projects[context.projectName].root;

  schema.outDir = schema.emitAtRootLevel
    ? path.resolve(context.root, schema.outDir)
    : schema.outDir;

  return eachValueFrom(startViteBuild(schema).pipe(map((res) => res)));
}
