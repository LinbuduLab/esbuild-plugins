import path from 'path';
import findUp from 'find-up';

import { isInGitDirectory } from './is-in-dir';

export const findPackagePaths = (): string[] => {
  // PROJECT/.git
  const gitDirectoryPath = findUp.sync('.git', {
    type: 'directory',
  });

  // PROJECT
  const gitRootPath: string | undefined =
    gitDirectoryPath === undefined ? undefined : path.dirname(gitDirectoryPath);

  let cwd: string = process.cwd();

  let packagePath: string | undefined;

  const packagePaths: string[] = [];

  while (
    (packagePath = findUp.sync('package.json', { type: 'file', cwd })) &&
    isInGitDirectory(packagePath, gitRootPath)
  ) {
    packagePaths.push(packagePath);
    cwd = path.dirname(path.dirname(packagePath));
  }

  return packagePaths;
};
