import { CAC } from 'cac';
import fs from 'fs-extra';
import path from 'path';
import jsonfile from 'jsonfile';
import enquirer from 'enquirer';
import semver from 'semver';
import consola from 'consola';
import execa from 'execa';
import chalk from 'chalk';

import { selectSingleProject } from '../utils/select-project';
import { allPackages } from '../utils/packages';
import { readWorkspacePackagesWithVersion } from '../utils/read-packages';

const enum ReleaseType {
  MAJOR = 'major',
  MINOR = 'minor',
  PATCH = 'patch',
  PREMAJOR = 'premajor',
  PREMINOR = 'preminor',
  PREPATCH = 'prepatch',
}

const RELEASE_TYPES: ReleaseType[] = [
  ReleaseType.MAJOR,
  ReleaseType.MINOR,
  ReleaseType.PATCH,
];

export interface ReleaseCLIOptions {
  type: ReleaseType;
  dryRun: boolean;
  version?: string;
  yes: boolean;
  skipGit: boolean;
}

/**
 * yarn cli release
 * -> choose package if not specified by `yarn cli release [name]`
 * -> choose release type
 * -> bump package.json version
 * -> collect deps
 * -> sync workspace package version
 * -> nx build/tsc project --with-deps
 * -> update dist/package.json
 * -> git add packages/PACKAGE (--dry-run --verbose)
 * -> git-cz --type release --scope PACKAGE --non-interactive --subject release PACKAGE UPDATED_VERSION
 * -> git tag
 * -> git push
 * -> git push --tags
 * -> npm publish --access=public (inside dist folder)
 *
 * TODO: revert on failure
 * @param cli
 */
export default function useReleaseProject(cli: CAC) {
  cli
    .command('release [name]', 'Release project', {
      allowUnknownOptions: true,
    })
    .option('--type', 'Choose release type', {
      default: ReleaseType.PATCH,
    })
    .option('--version [version]', 'Use custom version instead semver bump')
    .option('--skip-git', 'Skip git add & commit & push', {
      default: false,
    })
    // .option('--yes', 'Skip confirm prompt', {
    //   default: false,
    // })
    // .option('--no-yes', 'Donnot skip confirm prompt')
    .option('--dry-run', 'Use dry run mode', {
      default: false,
    })

    .alias('r')
    .action(async (name: string, options: ReleaseCLIOptions) => {
      try {
        const projectToRelease =
          name ??
          (await selectSingleProject([], 'Choose a project to release'));

        if (!allPackages.includes(projectToRelease)) {
          consola.error(
            `Oops, it seems that project ${chalk.cyan(
              projectToRelease
            )} does not exist.`
          );
          process.exit(1);
        }

        const { dryRun, version, skipGit } = options;

        const packagesInfo = readWorkspacePackagesWithVersion();

        const projectCurrentVersion = packagesInfo.find(
          (info) => info.project === projectToRelease
        )!.version;

        const releaseVersion =
          version ??
          (
            (await enquirer.prompt({
              type: 'select',
              name: 'version',
              message: 'Select release type',
              choices: RELEASE_TYPES.map(
                (incType) =>
                  `${incType} (${incredVersion(
                    projectCurrentVersion,
                    incType
                  )})`
              ),
            })) as { version: string }
          ).version.match(/\((.*)\)/)![1];

        if (!semver.valid(releaseVersion)) {
          consola.error(
            `Invalid target version: ${chalk.yellow(releaseVersion)}`
          );
          process.exit(1);
        }

        const releaseTag = `${projectToRelease}@${releaseVersion}`;

        consola.info(`Release Tag: ${chalk.cyan(releaseTag)}`);

        const { yes }: Record<'yes', string> = await enquirer.prompt({
          type: 'confirm',
          name: 'yes',
          message: `Releasing ${releaseTag}. Confirm?`,
          initial: true,
        });

        if (!yes) {
          consola.info(`Release ${releaseTag} canceled.`);
          process.exit(0);
        } else {
          consola.info(`Releasing ${releaseTag}...`);
        }

        const projectDir = path.join(
          process.cwd(),
          'packages',
          projectToRelease
        );

        const projectPkgPath = path.join(projectDir, 'package.json');
        const builtProjectPkgPath = path.join(
          projectDir,
          'dist',
          'package.json'
        );
        const pkgInfo = jsonfile.readFileSync(projectPkgPath);

        pkgInfo.version = releaseVersion;

        consola.info(
          'Collecting dependencies and sync workspace packages version...'
        );

        !dryRun &&
          (await execa(
            'yarn',
            ['cli', 'collect', projectToRelease, '--verbose'],
            {
              cwd: process.cwd(),
              preferLocal: true,
              stdio: 'inherit',
            }
          ));

        !dryRun &&
          (await execa('yarn', ['cli', 'sync', projectToRelease, '--verbose'], {
            cwd: process.cwd(),
            preferLocal: true,
            stdio: 'inherit',
          }));

        if (!dryRun) {
          fs.writeFileSync(
            projectPkgPath,
            JSON.stringify(pkgInfo, null, 2) + '\n'
          );
        }

        dryRunInfoLogger(
          `${projectToRelease} version updated to ${releaseVersion}`,
          dryRun
        );

        consola.info('Building packages...');

        !dryRun &&
          (await execa('nx', ['build', projectToRelease, '--verbose'], {
            cwd: process.cwd(),
            // enable preferLocal will cause workspace deps in dist package.json doesnot got update
            // preferLocal: true,
            stdio: 'inherit',
          }));

        dryRunSuccessLogger(
          `Package ${projectToRelease} built successfully.\n`,
          dryRun
        );

        consola.info('Updating necessary fields of `dist/package.json`...\n');

        const builtPkgInfo = jsonfile.readFileSync(builtProjectPkgPath);

        builtPkgInfo.main = './src/index.js';
        builtPkgInfo.version = releaseVersion;
        builtPkgInfo.typings = './src/index.d.ts';
        builtPkgInfo.executors
          ? (builtPkgInfo.executors = './executors.json')
          : void 0;
        builtPkgInfo.generators
          ? (builtPkgInfo.generators = './generators.json')
          : void 0;

        if (!dryRun) {
          fs.writeFileSync(
            builtProjectPkgPath,
            JSON.stringify(builtPkgInfo, null, 2) + '\n'
          );
        }

        const { stdout } = await execa('git', ['diff'], { stdio: 'pipe' });

        if (!stdout) {
          consola.error('No commit changes found, exist.');
          process.exit(0);
        }

        if (!skipGit) {
          dryRunInfoLogger('Committing changes...', dryRun);

          await execa(
            'git',
            ['add', `packages/${projectToRelease}`, '--verbose'].concat(
              dryRun ? ['--dry-run'] : []
            ),
            {
              stdio: 'inherit',
            }
          );

          const gitCZCommandArgs = [
            '--type=release',
            `--scope=${projectToRelease.split('-')[0]}`,
            `--subject=Release ${releaseTag}`,
            '--non-interactive',
          ];

          !dryRun
            ? await execa('git-cz', gitCZCommandArgs, {
                stdio: 'inherit',
                preferLocal: true,
              })
            : consola.info(
                `${chalk.white('DRY RUN MODE')}: Executing >>> ${chalk.cyan(
                  `git-cz ${gitCZCommandArgs.join(' ')}`
                )}`
              );

          !dryRun
            ? await execa('git', ['tag', releaseTag], {
                stdio: 'inherit',
              })
            : consola.info(
                `${chalk.white('DRY RUN MODE')}: Executing >>> ${chalk.cyan(
                  `git tag ${releaseTag}`
                )}`
              );

          await execa(
            'git',
            [
              'push',
              'origin',
              `refs/tags/${releaseTag}`,
              '--verbose',
              '--progress',
            ].concat(dryRun ? ['--dry-run'] : []),
            {
              stdio: 'inherit',
            }
          );

          console.log('\n');

          await execa(
            'git',
            ['push', '--verbose', '--progress'].concat(
              dryRun ? ['--dry-run'] : []
            ),
            {
              stdio: 'inherit',
            }
          );
        } else {
          consola.warn('Remember you have skipped git process.');
        }

        console.log('\n');

        dryRunInfoLogger('Pubishing package...', dryRun);

        const { stdout: logAs } = await execa('npm', ['whoami'], {
          cwd: projectDir,
          stdio: 'pipe',
          shell: true,
          preferLocal: true,
        });

        consola.info(`You're now logged as ${chalk.bold(chalk.white(logAs))}`);

        await execa(
          'npm',
          ['publish', '--access=public'].concat(dryRun ? ['--dry-run'] : []),
          {
            cwd: path.resolve(projectDir, 'dist'),
            stdio: 'inherit',
            shell: true,
            preferLocal: true,
          }
        );

        dryRunSuccessLogger('Package published.', dryRun);
      } catch (error) {
        consola.error(error);
      }
    });
}

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
