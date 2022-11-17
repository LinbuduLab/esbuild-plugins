import { CAC } from 'cac';
import consola from 'consola';
import chalk from 'chalk';

import { selectSingleProject } from '../utils/select-project';
import { allPackages } from '../utils/packages';
import { readWorkspacePackagesWithVersion } from '../utils/read-packages';
import { ReleaseType } from './utils';
import { ReleaseHandlers } from './handlers';

export interface ReleaseCLIOptions {
  type: ReleaseType;
  dry: boolean;
  version?: string;
  yes: boolean;
  skipGit: boolean;
  beta: boolean;
  publishTag: string;
}

/**
 * pnpm cli release [project] --options
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
    .option('--publish-tag [publishTag]', 'Use custom publish tag')
    .option('--skip-git', 'Skip git add & commit & push', {
      default: false,
    })
    .option('--dry', 'Use dry run mode')
    .alias('r')
    .option('--beta', 'Release as beta version and beta tag')
    .action(async (name: string, options: ReleaseCLIOptions) => {
      let preversedOriginalVersion: string = 'Unassigned';
      let packageJsonVersionUpdated = false;

      const projectToRelease =
        name ?? (await selectSingleProject([], 'Choose a project to release'));

      try {
        if (!allPackages.includes(projectToRelease)) {
          consola.error(
            `Oops, it seems that project ${chalk.cyan(
              projectToRelease
            )} does not exist.`
          );
          process.exit(1);
        }

        const {
          version: inputVersion,
          skipGit,
          dry: dryRun = false,
          publishTag: _publishTag,
          beta = false,
        } = options;

        const packagesInfo = readWorkspacePackagesWithVersion();

        const projectCurrentVersion = packagesInfo.find(
          (info) => info.project === projectToRelease
        )!.version;

        preversedOriginalVersion = projectCurrentVersion;

        const releaseVersion = await ReleaseHandlers.getExpectedReleaseVersion(
          projectCurrentVersion,
          inputVersion
        );

        const useBetaMode = beta || releaseVersion.includes('-beta.');

        const publishTag = useBetaMode ? 'beta' : _publishTag;

        const releaseTag = ReleaseHandlers.composeReleaseTag(
          projectToRelease,
          releaseVersion
        );

        await ReleaseHandlers.confirmReleaseOperation(releaseTag);

        ReleaseHandlers.updatePackageJsonVersion(
          projectToRelease,
          releaseVersion,
          dryRun
        );

        packageJsonVersionUpdated = true;

        await ReleaseHandlers.cleanPackageDist(projectToRelease, dryRun);

        await ReleaseHandlers.executePackageBuildScript(
          projectToRelease,
          dryRun
        );

        await ReleaseHandlers.executeGitDiffAndPush(
          projectToRelease,
          releaseTag,
          skipGit,
          dryRun
        );

        // await ReleaseHandlers.checkNPMProfile(projectToRelease);

        await ReleaseHandlers.publishPackage(
          projectToRelease,
          publishTag,
          dryRun
        );

        consola.success(`Release ${chalk.cyan(releaseTag)} completed.`);
        process.exit(0);
      } catch (error) {
        ReleaseHandlers.handleScriptError(
          error,
          projectToRelease,
          preversedOriginalVersion,
          packageJsonVersionUpdated
        );
      }
    });
}
