import { CAC } from 'cac';
import fs from 'fs-extra';
import path from 'path';
import jsonfile from 'jsonfile';
import prettier from 'prettier';
import enquirer from 'enquirer';
import semver from 'semver';

import {
  CompilerOptions,
  ModuleKind,
  ModuleResolutionKind,
  ScriptTarget,
} from 'typescript';
import execa from 'execa';
import workspace from '../../workspace.json';
import tsconfigBase from '../../tsconfig.base.json';
import { getPluginDir } from '../utils/constants';
import sortPackageJson from 'sort-package-json';
import ow from 'ow';
import { selectSingleProject } from '../utils/select-project';
import { allPackages } from '../utils/packages';
import consola from 'consola';
import { readPackagesWithVersion } from '../utils/read-packages';
import chalk from 'chalk';

// 不需要CHANGELOG
// yarn cli release
// -> 选择 package
// -> 选择 release type
// -> bump version
// -> collect deps
// -> (optinal)bump dep workspace package version
// -> nx build --with-deps
// git add packages/PACKAGE (--dry-run --verbose)
// git-cz --type release --scope PACKAGE --non-interactive --subject release PACKAGE Version xxx
// git tag
// git push
// git push --tags
// yarn cli release PACKAGE --minor

const enum ReleaseType {
  MAJOR = 'major',
  MINOR = 'minor',
  PATCH = 'patch',
  PREMAJOR = 'premajor',
  PREMINOR = 'preminor',
  PREPATCH = 'prepatch',

  // BETA = 'beta',
  // RC
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
}

export default function useReleaseProject(cli: CAC) {
  cli
    .command('release [name]', 'Release project', {
      allowUnknownOptions: true,
    })
    .option('--type', 'Choose release type', {
      default: ReleaseType.PATCH,
    })
    .option('--version [version]', 'Use custom version instead semver bump')
    .option('--with-deps', 'Build package with deps', {
      default: true,
    })
    .option('--no-with-deps', 'Build package without deps')
    .option('--dry-run', 'Use dry run mode', {
      default: false,
    })

    .alias('r')
    .action(async (name: string, options: ReleaseCLIOptions) => {
      const projectToRelease =
        name ?? (await selectSingleProject([], 'Choose a project to release'));

      if (!allPackages.includes(projectToRelease)) {
        consola.error(
          `Oops, it seems that project [${projectToRelease}] does not exist.`
        );
        process.exit(1);
      }

      const { dryRun, version } = options;

      const packagesInfo = readPackagesWithVersion();

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
                `${incType} (${incredVersion(projectCurrentVersion, incType)})`
            ),
          })) as { version: string }
        ).version.match(/\((.*)\)/)![1];

      if (!semver.valid(releaseVersion)) {
        throw new Error(`invalid target version: ${releaseVersion}`);
      }

      const releaseTag = `${projectToRelease}@${releaseVersion}`;

      consola.info(`Release Info: ${chalk.cyan(releaseTag)}`);

      const { yes }: Record<'yes', string> = await enquirer.prompt({
        type: 'confirm',
        name: 'yes',
        message: `Releasing ${releaseTag}. Confirm?`,
        initial: true,
      });

      if (!yes) {
        consola.info(`Release ${releaseTag} canceled.`);
        return;
      }

      const projectDir = path.join(process.cwd(), 'packages', projectToRelease);
      const projectPkgPath = path.join(projectDir, 'package.json');
      const pkgInfo = jsonfile.readFileSync(projectPkgPath);

      pkgInfo.version = releaseVersion;

      !dryRun &&
        fs.writeFileSync(
          projectPkgPath,
          JSON.stringify(pkgInfo, null, 2) + '\n'
        );

      consola.info(`${projectToRelease} version updated to ${releaseVersion}`);

      consola.info('Building packages...');

      // TODO: try/catch
      await execa('nx', ['build', projectToRelease, '--verbose'], {
        cwd: process.cwd(),
        preferLocal: true,
        stdio: 'inherit',
      });

      consola.success('Package built successfully.');

      const { stdout } = await execa('git', ['diff'], { stdio: 'pipe' });

      if (stdout) {
        consola.info('Committing changes...');

        await execa(
          'git',
          ['add', `packages/${projectToRelease}`, '--verbose'],
          {
            stdio: 'inherit',
          }
        );

        await execa(
          'git-cz',
          [
            '--type=release',
            `--scope=${projectToRelease.split('-')[0]}`,
            `--subject=Release ${releaseTag}`,
            '--non-interactive',
          ],
          {
            stdio: 'inherit',
            preferLocal: true,
          }
        );

        await execa('git', ['tag', releaseTag], {
          stdio: 'inherit',
        });

        await execa(
          'git',
          [
            'push',
            'origin',
            `refs/tags/${releaseTag}`,
            '--verbose',
            '--dry-run',
            '--progress',
          ],
          {
            stdio: 'inherit',
          }
        );

        await execa('git', ['push', '--verbose', '--dry-run', '--progress'], {
          stdio: 'inherit',
        });
      } else {
        console.info('No changes to commit.');
      }

      consola.info('Pubishing package...');

      await execa('npm', ['publish', '--access=public', '--dry-run'], {
        cwd: projectDir,
        stdio: 'inherit',
      });
    });
}

export const incredVersion = (currentVer: string, type: ReleaseType) =>
  semver.inc(currentVer, type);
