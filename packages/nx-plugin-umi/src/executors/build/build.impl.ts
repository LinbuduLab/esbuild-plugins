import { ExecutorContext } from '@nrwl/devkit';
import { Service } from 'umi/lib/ServiceWithBuiltIn';
import initWebpack from '../utils/initWebpack';
import path from 'path';
import chalk from 'chalk';

import { UmiBuildExecutorSchema } from './schema';

// forkTSChecker: {
//   typescript: {
//     enabled: true,
//     configFile: 'apps/umi-app/tsconfig.json',
//   },
// },

export default async function runExecutor(
  options: UmiBuildExecutorSchema,
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

  const cwdPath = path.resolve(cwd);

  process.env.APP_ROOT = path.resolve(cwdPath, 'src');

  console.log(chalk.green(`Using cwd path: ${cwdPath}`));

  console.log(
    chalk.green(
      `Loading package.json from: ${path.resolve(cwdPath, 'package.json')}`
    )
  );

  initWebpack(cwd);

  const service = new Service({
    cwd: cwdPath,
    pkg: require(path.resolve(cwdPath, 'package.json')),
  });

  process.env.APP_ROOT = path.resolve(cwdPath, 'src');

  console.log(
    chalk.cyan(`process.env.UMI_VERSION: ${process.env.UMI_VERSION}`)
  );

  console.log(chalk.cyan(`process.env.UMI_DIR: ${process.env.UMI_DIR}`));

  console.log(chalk.cyan(`process.env.APP_ROOT: ${process.env.APP_ROOT}`));

  await service.run({
    name: 'build',
    args: {},
  });

  return {
    success: true,
  };
}
