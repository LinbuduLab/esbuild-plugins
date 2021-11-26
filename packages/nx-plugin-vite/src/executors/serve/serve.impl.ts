import type { ExecutorContext } from '@nrwl/devkit';
import type { ViteServeSchema } from './schema';

import { startViteAsync } from './lib/vite-serve';
import { preflightCheck } from '../utils/preflight-check';

export default async function runExecutor(
  schema: ViteServeSchema,
  context: ExecutorContext
) {
  preflightCheck(context, schema.configFile);

  schema.root =
    schema.root ?? context.workspace.projects[context.projectName].root;

  return await startViteAsync(schema);
}
