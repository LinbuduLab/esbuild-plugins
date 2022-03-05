import type { VitePreviewSchema } from './schema';
import type { ExecutorContext } from '@nrwl/devkit';

import { map } from 'rxjs/operators';

import { eachValueFrom } from 'rxjs-for-await';

import { startVitePreview } from './lib/vite-preview';
import { preflightCheck } from '../utils/preflight-check';

// Vite doesnot export preview handler
export default function runExecutor(
  schema: VitePreviewSchema,
  context: ExecutorContext
) {
  preflightCheck(context, schema.configFile);

  schema.root =
    schema.root ?? context.workspace.projects[context.projectName].root;

  return eachValueFrom(startVitePreview(schema).pipe(map((res) => res)));
}
