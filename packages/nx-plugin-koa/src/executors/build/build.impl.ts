import type { ExecutorContext } from '@nrwl/devkit';
import type { BuildNodeBuilderOptions } from '@nrwl/node/src/utils/types';

import { buildExecutor as nodeBuildExecutor } from '@nrwl/node/src/executors/build/build.impl';

// TODO: extend based on it...
export default function buildExecutor(
  rawOptions: BuildNodeBuilderOptions,

  context: ExecutorContext
) {
  console.log('rawOptions: ', rawOptions);
  return nodeBuildExecutor(rawOptions, context);
}
