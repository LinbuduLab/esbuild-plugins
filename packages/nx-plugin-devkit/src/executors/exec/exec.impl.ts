import { ExecutorContext } from '@nrwl/devkit';
import type { DevkitExecSchema } from './lib/types';
import { normalizeSchema } from './lib/normalize-schema';
import { loadEnvVars } from './lib/env';
import { runInParallel, runSerially } from './lib/runner';

export default async function (
  options: DevkitExecSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  loadEnvVars(options.envFile);
  const normalized = normalizeSchema(options);

  try {
    const success = normalized.parallel
      ? await runInParallel(normalized, context)
      : await runSerially(normalized, context);
    return { success };
  } catch (e) {
    throw new Error(
      `ERROR: Something went wrong in @nrwl/run-commands - ${e.message}`
    );
  }
}
