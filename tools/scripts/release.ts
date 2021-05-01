import execa from 'execa';
import path from 'path';
import fs from 'fs';
import minimist from 'minimist';
import chalk from 'chalk';
import ora from 'ora';
import enquirer from 'enquirer';
import semver from 'semver';
import jsonfile from 'jsonfile';

export interface Args {
  skipCheck?: boolean;
  dryRun?: boolean;
  version?: string;
  tag?: string;
}

const args = minimist(process.argv.slice(2), {
  alias: {
    'dry-run': 'dryRun',
    'skip-check': 'skipCheck',
  },
}) as Args;

const versionIncrements: semver.ReleaseType[] = [
  'patch',
  'minor',
  'major',
  'prepatch',
  'preminor',
  'premajor',
  'prerelease',
];

const inc = (currentVer: string, i: semver.ReleaseType) =>
  semver.inc(currentVer, i);

// choose project
// select or input version
//

type RunnerFunc = (
  bin: string,
  args: string[],
  opts?: Record<string, unknown>
) => Promise<void>;

const dryRun: RunnerFunc = async (
  bin: string,
  args: string[],
  opts: Record<string, unknown> = {}
) =>
  console.log(
    chalk.blue(`[dryrun] ${bin} ${args.join(' ')}`),
    Object.keys(opts) ? opts : null
  );

const exec: RunnerFunc = async (
  bin: string,
  args: string[],
  opts: Record<string, unknown> = {}
) => {
  await execa(bin, args, { stdio: 'inherit', ...opts });
};

const runIfNotDry = args.dryRun ? dryRun : exec;

const step = (msg: string) => console.log(chalk.cyan(msg));

function updateVersion(project: string, version: string) {
  const projectPath = path.join(process.cwd(), 'packages', project);
  const projectPkgPath = path.join(projectPath, 'package.json');
  const pkg = jsonfile.readFileSync(projectPkgPath);
  pkg.version = version;
  fs.writeFileSync(projectPkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

async function publishPackage(
  project: string,
  version: string,
  runIfNotDry: RunnerFunc
) {
  const publicArgs = [
    'publish',
    '--no-git-tag-version',
    '--new-version',
    version,
    '--access',
    'public',
  ];
  if (args.tag) {
    publicArgs.push(`--tag`, args.tag);
  }
  try {
    await runIfNotDry('npm', publicArgs, {
      stdio: 'pipe',
    });
    console.log(chalk.green(`Successfully published ${project}@${version}`));
  } catch (e) {
    if (e.stderr.match(/previously published/)) {
      console.log(chalk.red(`Skipping already published: ${project}`));
    } else {
      throw e;
    }
  }
}

async function main() {
  const tmpTargetProject = 'nx-plugin-esbuild';
  const tmpTargetVersion = '0.0.1-1';

  let targetVersion = args.version;

  if (!args.version) {
    const { release }: Record<'release', string> = await enquirer.prompt({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: versionIncrements
        .map((incType) => `${incType} (${inc(tmpTargetVersion, incType)})`)
        .concat(['custom']),
    });

    if (release === 'custom') {
      const { version }: Record<'version', string> = await enquirer.prompt({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: tmpTargetVersion,
      });
      targetVersion = version;
    } else {
      targetVersion = release.match(/\((.*)\)/)[1];
    }

    if (!semver.valid(targetVersion)) {
      throw new Error(`invalid target version: ${targetVersion}`);
    }

    const tag = `${tmpTargetProject}@${targetVersion}`;

    const { yes }: Record<'yes', string> = await enquirer.prompt({
      type: 'confirm',
      name: 'yes',
      message: `Releasing ${tag}. Confirm?`,
      initial: true,
    });

    if (!yes) {
      return;
    }
    step('\nUpdating package version...');
    updateVersion(tmpTargetProject, targetVersion);

    step('\nBuilding package...');
    if (!args.skipCheck && !args.dryRun) {
      // TODO: build flags
      await runIfNotDry('nx', ['build', tmpTargetProject]);
    } else {
      console.log(`(skipped)`);
    }

    // step('\nGenerating changelog...');
    // await run('yarn', ['changelog']);

    const { stdout } = await execa('git', ['diff'], { stdio: 'pipe' });
    if (stdout) {
      step('\nCommitting changes...');
      await runIfNotDry('git', ['add', '-A']);
      await runIfNotDry('git', ['commit', '-m', `release: ${tag}`]);
    } else {
      console.log('No changes to commit.');
    }

    // step('\nPublishing package...');
    // await publishPackage(tmpTargetProject, targetVersion, runIfNotDry);

    step('\nPushing to GitHub...');
    await runIfNotDry('git', ['tag', tag]);
    await runIfNotDry('git', ['push', 'origin', `refs/tags/${tag}`]);
    await runIfNotDry('git', ['push']);

    if (args.dryRun) {
      console.log(`\nDry run finished - run git diff to see package changes.`);
    }

    console.log();
  }
}

main();
