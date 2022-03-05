import type { ExecutorContext } from '@nrwl/devkit';
import type { NormalizedExecSchema } from './types';

import { calculateCwd } from './helper';
import { createExecaProcess, createSyncExecaProcess } from './create-process';

export async function runInParallel(
  options: NormalizedExecSchema,
  context: ExecutorContext
) {
  const cwd = calculateCwd(options.cwd, context);

  const processGroup = options.commands.map((c) =>
    createExecaProcess(c.command, cwd, options).then((success: boolean) => ({
      success,
      command: c.command,
    }))
  );

  const processExecResults = await Promise.all(processGroup);
  const failed = processExecResults.filter((v) => !v.success);

  if (failed.length > 0) {
    failed.forEach((f) => {
      process.stderr.write(
        `Error! command "${f.command}" exited with non-zero status code`
      );
    });

    return false;
  } else {
    return true;
  }
}

export async function runSerially(
  options: NormalizedExecSchema,
  context: ExecutorContext
) {
  const cwd = calculateCwd(options.cwd, context);
  for (const c of options.commands) {
    createSyncExecaProcess(c.command, cwd, options);
  }
  return true;
}
