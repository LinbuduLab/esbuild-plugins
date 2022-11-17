import { findPackagePaths } from './find-package-path';

export interface NodeExternalsOptions {
  /**
   * list of package.json paths to read from
   * if not specified, will read from cwd
   */
  packagePaths: string | string[];

  /**
   * mark all dependencies as external
   * @default true
   */
  withDeps: boolean;

  /**
   * mark all devDependencies as external
   * @default true
   */
  withDevDeps: boolean;

  /**
   * mark all peerDependencies as external
   * @default true
   */
  withPeerDeps: boolean;

  /**
   * mark all optionalDependencies as external
   * @default true
   */
  withOptDeps: boolean;

  /**
   * list of packages to exclude from externalization
   */
  include: string[];
}

export interface NormalizedNodeExternalsOptions extends NodeExternalsOptions {
  packagePaths: string[];
}

export const normalizeOptions = ({
  packagePaths,
  withDeps,
  withDevDeps,
  withPeerDeps,
  withOptDeps,
  include,
}: Partial<NodeExternalsOptions> = {}): NormalizedNodeExternalsOptions => {
  const normalizedOptions: NormalizedNodeExternalsOptions = {
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
