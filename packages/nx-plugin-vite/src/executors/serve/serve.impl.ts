import type { ExecutorContext } from '@nrwl/devkit';
import type { ViteServeSchema } from './schema';

import { eachValueFrom } from 'rxjs-for-await';
import { map } from 'rxjs/operators';

import { startViteServer } from './lib/vite-serve';
import { preflightCheck } from '../utils/preflight-check';

export default function runExecutor(
  schema: ViteServeSchema,
  context: ExecutorContext
) {
  preflightCheck(context, schema.configFile);

  schema.root =
    schema.root ?? context.workspace.projects[context.projectName].root;

  return eachValueFrom(startViteServer(schema).pipe(map((res) => res)));
}
