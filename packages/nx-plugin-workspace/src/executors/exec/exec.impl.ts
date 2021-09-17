import { ExecutorContext } from '@nrwl/devkit';
import type { WorkspaceExecSchema } from './lib/types';
import { normalizeSchema } from './lib/normalize-schema';
import { loadEnvVars } from './lib/env';
import { runInParallel, runSerially } from './lib/runner';

// Enhanced version of original @nrwl/workspace:run-commands
// support local installed packages execution
// PR: https://github.com/nrwl/nx/pull/6807
export default async function (
  options: WorkspaceExecSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  loadEnvVars(options.envFile);
  const normalized = normalizeSchema(options);

  if (!normalized.commands.length) {
    throw new Error(
      'No Commands Found! Please check is there any command specified in target configuration?'
    );
  }

  try {
    const success = normalized.parallel
      ? await runInParallel(normalized, context)
      : await runSerially(normalized, context);
    return { success };
  } catch (e) {
    throw new Error(
      `ERROR: Something went wrong in nx-plugin-workspace - ${e.message}`
    );
  }
}
