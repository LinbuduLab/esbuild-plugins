import execa from 'execa';
import { step, runIfNotDry } from './util';

export const gitPush = async (
  project: string,
  tag: string,
  dryRun: boolean
) => {
  const { stdout } = await execa('git', ['diff'], { stdio: 'pipe' });
  if (stdout) {
    step('\nCommitting changes...');
    await runIfNotDry(dryRun, 'git', ['add', '-A']);
    await runIfNotDry(dryRun, 'git', [
      'commit',
      '-m',
      `release${project}: ${tag}`,
    ]);
  } else {
    console.log('No changes to commit.');
  }

  await runIfNotDry(dryRun, 'git', ['tag', tag]);
  await runIfNotDry(dryRun, 'git', ['push', 'origin', `refs/tags/${tag}`]);
  await runIfNotDry(dryRun, 'git', ['push']);
};
