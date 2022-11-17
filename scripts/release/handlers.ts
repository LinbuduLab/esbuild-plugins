import fs from 'fs-extra';
import jsonfile from 'jsonfile';
import chalk from 'chalk';
import consola from 'consola';
import enquirer from 'enquirer';
import path from 'path';
import semver from 'semver';

import {
  RELEASE_TYPES,
  incredVersion,
  dryRunInfoLogger,
  dryRunSuccessLogger,
} from './utils';
import { DIST_DIR, PACKAGE_DIR } from '../utils/constants';
import execa from 'execa';

export class ReleaseHandlers {
  public static async confirmReleaseOperation(releaseTag: string) {
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
  }

  public static composeReleaseTag(project: string, version: string): string {
    const completeTag = `${project}@${version}`;

    consola.info(`Release Tag: ${chalk.cyan(completeTag)}`);

    return completeTag;
  }

  private static getBetaVersion(currentVersion: string): string {
    const isBeta = currentVersion.includes('-beta.');

    const [plainVersion, betaCount] = currentVersion.split('-beta.');

    return isBeta
      ? `${plainVersion}-beta.${betaCount + 1}`
      : `${currentVersion}-beta.0`;
  }

  public static async getExpectedReleaseVersion(
    currentVersion: string,
    inputVersion?: string
  ) {
    const expectedVersion =
      inputVersion ?? (<{ version: string }>await enquirer.prompt({
        type: 'select',
        name: 'version',
        message: 'Select release type',
        choices: RELEASE_TYPES.map(
          (incType) => `${incType} (${incredVersion(currentVersion, incType)})`
        ).concat([`beta (${ReleaseHandlers.getBetaVersion(currentVersion)})`]),
      })).version.match(/\((.*)\)/)![1];

    if (!semver.valid(expectedVersion)) {
      consola.error(`Invalid target version: ${chalk.yellow(expectedVersion)}`);
      process.exit(1);
    }

    return expectedVersion;
  }

  public static updatePackageJsonVersion(
    project: string,
    updatedVersion: string,
    dryRun: boolean
  ) {
    const projectDir = path.join(process.cwd(), PACKAGE_DIR, project);

    const projectPkgPath = path.join(projectDir, 'package.json');

    const pkgInfo = jsonfile.readFileSync(projectPkgPath);

    pkgInfo.version = updatedVersion;

    dryRun
      ? void 0
      : fs.writeFileSync(projectPkgPath, JSON.stringify(pkgInfo, null, 2));

    dryRunInfoLogger(`${project} version updated to ${updatedVersion}`, dryRun);
  }

  public static async cleanPackageDist(project: string, dryRun: boolean) {
    const projectDir = path.join(process.cwd(), PACKAGE_DIR, project);

    consola.info('Romoving dist folder...');

    await execa(`rm -rf ${path.resolve(projectDir, DIST_DIR)}`, {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: true,
    });

    dryRunSuccessLogger(`Package ${project} dist dir clened.\n`, dryRun);
  }

  public static async executePackageBuildScript(
    project: string,
    dryRun: boolean
  ) {
    const projectDir = path.join(process.cwd(), PACKAGE_DIR, project);

    consola.info('Building packages...');

    await execa('pnpm', ['build'], {
      cwd: projectDir,
      // enable preferLocal will cause workspace deps in dist package.json doesnot got update
      // preferLocal: true,
      stdio: 'inherit',
    });

    dryRunSuccessLogger(`Package ${project} built successfully.\n`, dryRun);
  }

  public static async executeGitDiffAndPush(
    project: string,
    releaseTag: string,
    skipGit: boolean,
    dryRun: boolean
  ) {
    if (skipGit) {
      consola.info('Skip git diff and commit actions.');
      return;
    }

    const { stdout } = await execa('git', ['diff'], { stdio: 'pipe' });

    if (!stdout) {
      consola.error('No commit changes found, exist.');
      process.exit(0);
    }

    dryRunInfoLogger('Committing changes...', dryRun);

    await execa(
      'git',
      ['add', `${PACKAGE_DIR}/${project}`, '--verbose'].concat(
        dryRun ? ['--dry-run'] : []
      ),
      {
        stdio: 'inherit',
      }
    );

    const gitCZCommandArgs = [
      '--type=release',
      `--scope=${project.split('-')[0]}`,
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

    dryRunSuccessLogger(`Changes on ${project} pushed successfully.\n`, dryRun);
  }

  public static async checkNPMProfile(project: string) {
    consola.info('Checking NPM profile...');
    const projectDir = path.join(process.cwd(), PACKAGE_DIR, project);

    const { stdout: logAs } = await execa('npm', ['whoami'], {
      cwd: projectDir,
      stdio: 'pipe',
      shell: true,
      preferLocal: true,
    });

    consola.info(`You're now logged as ${chalk.bold(chalk.white(logAs))}`);
  }

  public static async publishPackage(
    project: string,
    publishTag = 'latest',
    dryRun = true
  ) {
    dryRunInfoLogger('Pubishing package...', dryRun);

    const projectDir = path.join(process.cwd(), PACKAGE_DIR, project);

    const args = [
      'publish',
      '--registry=https://registry.npmjs.org/',
      '--access=public',
      '--no-git-checks',
      `--tag ${publishTag}`,
    ].concat(dryRun ? ['--dry-run'] : []);

    consola.info(`Publish args ${chalk.cyan(`${args.join(' ')}`)}`);

    await execa('pnpm', args, {
      cwd: projectDir,
      stdio: 'inherit',
      shell: true,
      preferLocal: true,
    });

    dryRunSuccessLogger('Package published.', dryRun);
  }

  public static handleScriptError(
    error: unknown,
    project: string,
    version: string,
    versionUpdated: boolean
  ): void {
    consola.error(error);
    versionUpdated &&
      consola.info(`Rollback to original version: ${chalk.cyan(version)}`);
    versionUpdated &&
      ReleaseHandlers.updatePackageJsonVersion(project, version, false);
    process.exit(1);
  }
}
