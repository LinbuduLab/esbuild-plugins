import type { Tree } from '@nrwl/tao/src/shared/tree';
import { execSync } from 'child_process';
import { join } from 'path';
import {
  detectPackageManager,
  getPackageManagerCommand,
} from '@nrwl/tao/src/shared/package-manager';
import type { PackageManager } from '@nrwl/tao/src/shared/package-manager';
import { joinPathFragments } from '@nrwl/devkit';
import execa from 'execa';
import consola from 'consola';

let storedPackageJsonValue: string;

/**
 * forked from @nrwl/devkit
 *
 * @param tree - the file system tree
 * @param force - always run the command even if `package.json` hasn't changed.
 * @param cwd cwd to execute install
 * @param packageManager one of npm/yarn/pnpm
 */
export function installPackagesTask(
  tree: Tree,
  force = false,
  cwd = '',
  packageManager: PackageManager = detectPackageManager(cwd)
): void {
  const packageJsonValue = tree.read(
    joinPathFragments(cwd, 'package.json'),
    'utf-8'
  );

  const shouldExecuteInstall =
    tree
      .listChanges()
      .find((f) => f.path === joinPathFragments(cwd, 'package.json')) || force;

  if (!shouldExecuteInstall) {
    consola.info('Install skipped.');
    return;
  }

  consola.info('Install task starting...');

  // Don't install again if install was already executed with package.json
  if (storedPackageJsonValue != packageJsonValue || force) {
    storedPackageJsonValue = packageJsonValue;
    const installCommand = getPackageManagerCommand(packageManager).install;

    execa.sync(installCommand, {
      cwd: join(tree.root, cwd),
      stdio: 'inherit',
    });

    consola.success('Install task accomplished.');
  }
}
