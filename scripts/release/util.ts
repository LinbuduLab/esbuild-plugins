import semver, { ReleaseType } from 'semver';
import execa, { Options as ExecaOptions } from 'execa';
import chalk from 'chalk';

export interface Args {
  skipCheck?: boolean;
  dryRun?: boolean;
  version?: string;
  tag?: string;
  withDeps?: boolean;
}

export const releaseTypes: ReleaseType[] = [
  'patch',
  'minor',
  'major',
  'prepatch',
  'preminor',
  'premajor',
  'prerelease',
];

export const increVersion = (currentVer: string, type: ReleaseType) =>
  semver.inc(currentVer, type);

export const runIfNotDry = async (
  dryRun: boolean,
  bin: string,
  args: string[],
  opts: ExecaOptions<string> = {}
) => {
  if (dryRun) {
    console.log(
      chalk.blue(`[dryrun] ${bin} ${args.join(' ')}`),
      Object.keys(opts) ? opts : null
    );
  } else {
    await execa(bin, args, { stdio: 'inherit', ...opts });
  }
};

export const step = (msg: string) => console.log(chalk.cyan(msg));
