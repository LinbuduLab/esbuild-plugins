import { ExecutorContext } from '@nrwl/devkit';
import { map, switchMap, tap } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';
import { startUmiServe } from '../utils/start-umi-serve';

import { UmiServeExecutorSchema } from './schema';

export default function runExecutor(
  options: UmiServeExecutorSchema,
  context: ExecutorContext
) {
  process.env.NODE_ENV = 'production';

  const { projectName, root: workspaceRoot } = context;

  const {
    root: projectRoot,
    sourceRoot: projectSourceRoot,
  } = context.workspace.projects[projectName];

  if (!options.cwd) {
    console.log(`cwd is not provided, will use ${projectRoot} instead`);
  }

  const cwd = options.cwd ?? projectRoot;

  return eachValueFrom(
    startUmiServe(cwd).pipe(
      tap((x) => {}),
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
