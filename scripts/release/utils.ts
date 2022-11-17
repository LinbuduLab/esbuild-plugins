import chalk from 'chalk';
import consola from 'consola';
import semver from 'semver';

export const enum ReleaseType {
  MAJOR = 'major',
  MINOR = 'minor',
  PATCH = 'patch',
  PREMAJOR = 'premajor',
  PREMINOR = 'preminor',
  PREPATCH = 'prepatch',
}

export const RELEASE_TYPES: ReleaseType[] = [
  ReleaseType.MAJOR,
  ReleaseType.MINOR,
  ReleaseType.PATCH,
];

export const incredVersion = (currentVer: string, type: ReleaseType) =>
  semver.inc(currentVer, type);

export const dryRunInfoLogger = (msg: string, dryRun: boolean) =>
  dryRun
    ? consola.info(`${chalk.white('DRY RUN MODE')}: ${msg}`)
    : consola.info(msg);

export const dryRunSuccessLogger = (msg: string, dryRun: boolean) =>
  dryRun
    ? consola.success(`${chalk.white('DRY RUN MODE')}: ${msg}`)
    : consola.success(msg);
