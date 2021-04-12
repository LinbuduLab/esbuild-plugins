import { findPackagePaths } from './find-package-path';

export interface Options {
  packagePaths: string | string[];
  withDeps: boolean;
  withDevDeps: boolean;
  withPeerDeps: boolean;
  withOptDeps: boolean;
  include: string[];
}

export interface NormalizedOptions extends Options {
  packagePaths: string[];
}

export const normalizeOptions = ({
  packagePaths,
  withDeps,
  withDevDeps,
  withPeerDeps,
  withOptDeps,
  include,
}: Partial<Options> = {}): NormalizedOptions => {
  const normalizedOptions: NormalizedOptions = {
    packagePaths: [],
    withDeps: withDeps ?? true,
    withDevDeps: withDevDeps ?? true,
    withPeerDeps: withPeerDeps ?? true,
    withOptDeps: withOptDeps ?? true,
    include: include ?? [],
  };

  if (!packagePaths) {
    normalizedOptions.packagePaths = findPackagePaths();
  }

  if (typeof packagePaths === 'string') {
    normalizedOptions.packagePaths.push(packagePaths);
  }

  if (Array.isArray(packagePaths)) {
    normalizedOptions.packagePaths.push(
      ...packagePaths.filter((item) => typeof item === 'string')
    );
  }

  return normalizedOptions;
};
