import execa from 'execa';
import path from 'path';
import chalk from 'chalk';

import { Args } from './util';

export const publishNPMPackage = async (
  project: string,
  version: string,
  args: Args
) => {
  const builtProjectDist = path.join(
    process.cwd(),
    'dist',
    'packages',
    project
  );
  const publicArgs = ['publish', '--access', 'public'];
  if (args.tag) {
    publicArgs.push(`--tag`, args.tag);
  }
  if (args.dryRun) {
    publicArgs.push('--dry-run');
  }
  try {
    await execa('npm', publicArgs, {
      stdio: 'pipe',
      cwd: builtProjectDist,
    });
    console.log(chalk.green(`Successfully published ${project}@${version}`));
  } catch (e) {
    if (e.stderr.match(/previously published/)) {
      console.log(chalk.red(`Skipping already published: ${project}`));
    } else {
      throw e;
    }
  }
};
