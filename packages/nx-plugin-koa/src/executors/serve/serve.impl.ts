import '@nrwl/node/src/executors/build/build.impl';
import type { ExecutorContext } from '@nrwl/devkit';
import type { NodeExecuteBuilderOptions } from '@nrwl/node/src/executors/execute/execute.impl';

import { executeExecutor as nodeExecuteExecutor } from '@nrwl/node/src/executors/execute/execute.impl';

// TODO: extend based on it...
// FIXME: refactor to async/await + rxjs form
export default async function* serveExecutor(
  rawOptions: NodeExecuteBuilderOptions,
  context: ExecutorContext
) {
  return yield* nodeExecuteExecutor(rawOptions, context);
}
