import minimist from 'minimist';
import enquirer from 'enquirer';
import semver from 'semver';

import { Args, releaseTypes, increVersion, runIfNotDry, step } from './util';

import { updateVersion } from './update-version';
import { publishNPMPackage } from './npm-publish';
import { gitPush } from './git-push';
import { readPackagesWithVersion } from '../utils/read-packages';
import { changelog } from './changelog';
import { selectSingleProject, selectScope } from '../utils/select-project';

const args = minimist(process.argv.slice(2), {
  alias: {
    'dry-run': 'dryRun',
    'skip-check': 'skipCheck',
    'with-deps': 'withDeps',
  },
}) as Args;

const packagesInfo = readPackagesWithVersion();

export async function main() {
  const {
    dryRun = false,
    tag = '',
    withDeps = true,
    version = '',
    skipCheck = false,
  } = args;

  let targetVersion = version;
  const scope = await selectScope();
  const targetProject = await selectSingleProject([], null, scope);

  const currentVersion = packagesInfo.find(
    (info) => info.project === targetProject
  ).version;

  if (!targetVersion) {
    const { release }: Record<'release', string> = await enquirer.prompt({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: releaseTypes
        .map(
          (incType) => `${incType} (${increVersion(currentVersion, incType)})`
        )
        .concat(['custom']),
    });

    if (release === 'custom') {
      const { version }: Record<'version', string> = await enquirer.prompt({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion,
      });
      targetVersion = version;
    } else {
      targetVersion = release.match(/\((.*)\)/)[1];
    }

    if (!semver.valid(targetVersion)) {
      throw new Error(`invalid target version: ${targetVersion}`);
    }
  }

  const releaseTag = `${targetProject}@${targetVersion}`;

  const { yes }: Record<'yes', string> = await enquirer.prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing ${releaseTag}. Confirm?`,
    initial: true,
  });

  if (!yes) {
    return;
  }

  step('\nUpdating package version...');
  updateVersion(targetProject, targetVersion, dryRun);

  step('\nBuilding package...');
  const nxBuildFlags = ['build', targetProject];

  // TODO: more build flags
  if (withDeps) {
    nxBuildFlags.push('--with-deps');
  }

  await runIfNotDry(dryRun, 'nx', nxBuildFlags);

  step('\nGenerating changelog...');

  if (!dryRun) {
    changelog(targetProject);
  }

  await gitPush(targetProject, releaseTag, dryRun);

  step('\nPublishing package...');
  await publishNPMPackage(targetProject, targetVersion, args);

  if (dryRun) {
    console.log(`\nDry run finished - run git diff to see package changes.`);
  }

  console.log();
}

main();
