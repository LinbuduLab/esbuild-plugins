import { ExecutorContext } from '@nrwl/devkit';
import { eachValueFrom } from 'rxjs-for-await';
import { map } from 'rxjs/operators';
import path from 'path';
import fs from 'fs-extra';
import { startViteBuild } from './lib/vite-build';
import { ViteBuildSchema } from './schema';

export default function runExecutor(
  schema: ViteBuildSchema,
  context: ExecutorContext
) {
  // TODO: extract as devkit.ensureProjectConfig
  const {
    sourceRoot: projectSourceRoot,
    root: projectRoot,
  } = context.workspace.projects[context.projectName];

  if (!projectSourceRoot) {
    throw new Error(`${context.projectName} does not have a sourceRoot.`);
  }

  if (!projectRoot) {
    throw new Error(`${context.projectName} does not have a root.`);
  }

  if (!fs.existsSync(path.resolve(context.root, schema.configFile))) {
    throw new Error(`vite config file cannot be found in ${schema.configFile}`);
  }

  schema.outDir = schema.emitAtRootLevel
    ? path.resolve(context.root, schema.outDir)
    : schema.outDir;

  return eachValueFrom(
    startViteBuild(schema).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
