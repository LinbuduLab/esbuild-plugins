import { runExecutor, parseTargetString, ExecutorContext } from '@nrwl/devkit';

export interface RunWaitUntilTargetsOptions {
  waitUntilTargets: string[];
}

export function runWaitUntilTargets<T extends RunWaitUntilTargetsOptions>(
  options: T,
  context: ExecutorContext
): Promise<{ success: boolean }[]> {
  return Promise.all(
    options.waitUntilTargets.map(async (waitUntilTarget) => {
      const target = parseTargetString(waitUntilTarget);
      const output = await runExecutor(target, {}, context);
      // eslint-disable-next-line no-async-promise-executor
      return new Promise<{ success: boolean }>(async (resolve) => {
        // resolve完继续执行，还会不断更新吗？
        const event = await output.next();
        // Resolve after first event
        resolve(event.value as { success: boolean });

        // Continue iterating
        // while (!event.done) {
        //   event = await output.next();
        // }
      });
    })
  );
}
