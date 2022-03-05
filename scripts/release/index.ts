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
import { PLUGIN_DIR } from '../utils/constants';

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
  dry: boolean;
  version?: string;
  yes: boolean;
  skipGit: boolean;
}

/**
 * pnpm cli release
 * -> choose package if not specified by `pnpm cli release [name]`
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
    .option('--version [version]', 'Use custom version instead by semver bump')
    .option('--skip-git', 'Skip git add & commit & push', {
      default: false,
    })
    .option('--no-dry', 'Donot use dry run mode')
    .option('--dry', 'Use dry run mode')
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

        /**
         * Nx plugin specified release flow:
         *
         * - publish dist dir
         * - modify package.json fields to suit prod
         * - sync workspace dependencies(nx-plugin-devkit) as dist dir is not regarded as workspace package
         */
        const useNxReleaseWorkflow =
          projectToRelease.startsWith('nx-plugin') &&
          !projectToRelease.endsWith('devkit');

        consola.info('useNxReleaseWorkflow: ', useNxReleaseWorkflow);

        const { dry: dryRun, version, skipGit } = options;

        const packagesInfo = readWorkspacePackagesWithVersion();

        const projectCurrentVersion = packagesInfo.find(
          (info) => info.project === projectToRelease
        ).version;

        const releaseVersion =
          version ?? (<{ version: string }>await enquirer.prompt({
            type: 'select',
            name: 'version',
            message: 'Select release type',
            choices: RELEASE_TYPES.map(
              (incType) =>
                `${incType} (${incredVersion(projectCurrentVersion, incType)})`
            ),
          })).version.match(/\((.*)\)/)![1];

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
          PLUGIN_DIR,
          projectToRelease
        );

        const projectPkgPath = path.join(projectDir, 'package.json');

        const pkgInfo = jsonfile.readFileSync(projectPkgPath);

        pkgInfo.version = releaseVersion;

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

        await execa('nx', ['build', projectToRelease, '--verbose'], {
          cwd: process.cwd(),
          // enable preferLocal will cause workspace deps in dist package.json doesnot got update
          // preferLocal: true,
          stdio: 'inherit',
        });

        dryRunSuccessLogger(
          `Package ${projectToRelease} built successfully.\n`,
          dryRun
        );

        if (useNxReleaseWorkflow) {
          const builtProjectPkgPath = path.join(
            projectDir,
            'dist',
            'package.json'
          );

          consola.info('Updating necessary fields of `dist/package.json`...\n');

          const builtPkgInfo = jsonfile.readFileSync(builtProjectPkgPath);

          builtPkgInfo.executors
            ? (builtPkgInfo.executors = './executors.json')
            : void 0;
          builtPkgInfo.generators
            ? (builtPkgInfo.generators = './generators.json')
            : void 0;

          const devkitWorkspaceVersion = packagesInfo.find(
            (info) => info.project === 'nx-plugin-devkit'
          ).version;

          builtPkgInfo.dependencies[
            'nx-plugin-devkit'
          ] = `^${devkitWorkspaceVersion}`;

          if (!dryRun) {
            fs.writeFileSync(
              builtProjectPkgPath,
              JSON.stringify(builtPkgInfo, null, 2) + '\n'
            );
          }
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
            ['add', `${PLUGIN_DIR}/${projectToRelease}`, '--verbose'].concat(
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

          dryRun
            ? consola.info(
                `${chalk.white('DRY RUN MODE')}: Executing >>> ${chalk.cyan(
                  `git-cz ${gitCZCommandArgs.join(' ')}`
                )}`
              )
            : await execa('git-cz', gitCZCommandArgs, {
                stdio: 'inherit',
                preferLocal: true,
              });

          dryRun
            ? consola.info(
                `${chalk.white('DRY RUN MODE')}: Executing >>> ${chalk.cyan(
                  `git tag ${releaseTag}`
                )}`
              )
            : await execa('git', ['tag', releaseTag], {
                stdio: 'inherit',
              });

          dryRun
            ? consola.info(
                `${chalk.white('DRY RUN MODE')}: Executing >>> ${chalk.cyan(
                  `git push origin refs/tags/${releaseTag} --verbose --progress`
                )}`
              )
            : await execa(
                'git',
                [
                  'push',
                  'origin',
                  `refs/tags/${releaseTag}`,
                  '--verbose',
                  '--progress',
                ],
                {
                  stdio: 'inherit',
                }
              );

          console.log('\n');
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
          'pnpm',
          ['publish', 'dist', '--access=public', '--no-git-checks'].concat(
            dryRun ? ['--dry-run'] : []
          ),
          {
            cwd: projectDir,
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
