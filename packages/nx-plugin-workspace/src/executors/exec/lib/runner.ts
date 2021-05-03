import { ExecutorContext } from '@nrwl/devkit';
import {
  createExecaProcess,
  createSyncExecaProcess,
  calculateCwd,
} from './helper';
import type { NormalizedExecSchema } from './types';

export async function runInParallel(
  options: NormalizedExecSchema,
  context: ExecutorContext
) {
  const procs = options.commands.map((c) =>
    createExecaProcess(
      c.command,
      options.color,
      calculateCwd(options.cwd, context)
    ).then((result: boolean) => ({
      result,
      command: c.command,
    }))
  );
  {
    const r = await Promise.all(procs);
    const failed = r.filter((v) => !v.result);
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
}

export async function runSerially(
  options: NormalizedExecSchema,
  context: ExecutorContext
) {
  for (const c of options.commands) {
    createSyncExecaProcess(
      c.command,
      options.color,
      calculateCwd(options.cwd, context)
    );
  }
  return true;
}
