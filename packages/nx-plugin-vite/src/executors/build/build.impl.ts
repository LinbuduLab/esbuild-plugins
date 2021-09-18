import { ExecutorContext } from '@nrwl/devkit';
import { eachValueFrom } from 'rxjs-for-await';
import { map, tap } from 'rxjs/operators';
import { ensureProjectConfig } from 'nx-plugin-devkit';
import path from 'path';
import fs from 'fs-extra';
import { startViteBuild } from './lib/vite-build';
import { ViteBuildSchema } from './schema';
import chalk from 'chalk';

export default function runExecutor(
  schema: ViteBuildSchema,
  context: ExecutorContext
) {
  ensureProjectConfig(context);

  if (!fs.existsSync(path.resolve(context.root, schema.configFile))) {
    throw new Error(`vite config file cannot be found in ${schema.configFile}`);
  }

  schema.outDir = schema.emitAtRootLevel
    ? path.resolve(context.root, schema.outDir)
    : schema.outDir;

  return eachValueFrom(startViteBuild(schema).pipe(map((res) => res)));
}
