import type { ExecutorContext } from '@nrwl/devkit';
import { ensureProjectConfig } from 'nx-plugin-devkit';

import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';

export function preflightCheck(context: ExecutorContext, configFile: string) {
  ensureProjectConfig(context);

  if (!fs.existsSync(path.resolve(context.root, configFile))) {
    throw new Error(`Vite config file not found in ${chalk.white(configFile)}`);
  }
}
