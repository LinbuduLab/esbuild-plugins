import path from 'path';
import jsonfile from 'jsonfile';
import pacote from 'pacote';
import { allPackages } from '../utils/packages';
import { readWorkspacePackagesWithVersion } from '../utils/read-packages';

export async function collectDepsVersion(deps: string[]) {
  const depsInfoWithVersion: Record<string, string> = {};

  for (const dep of deps) {
    const manifest = await pacote.manifest(dep);
    const version = manifest.version;
    depsInfoWithVersion[dep] = `~${version}`;
  }

  return depsInfoWithVersion;
}

export function collectDepsVersionFromProjectPackage(deps: string[]) {
  const filteredDeps: string[] = deps.filter((dep) =>
    allPackages.includes(dep)
  );

  const packagesWithVersion = readWorkspacePackagesWithVersion().filter(
    (pair) => filteredDeps.includes(pair.project)
  );

  const packageVersionRecord: Record<string, string> = {};

  packagesWithVersion.reduce((prev, curr) => {
    prev[curr.project] = `^${curr.version}`;
    return prev;
  }, packageVersionRecord);

  return packageVersionRecord;
}

export function collectDepsVersionFromRootPackage(deps: string[]) {
  const depsInfoWithVersion: Record<string, string> = {};

  const rootPackge: Record<
    'dependencies' | 'devDependencies' | 'peerDependencies',
    Record<string, string>
  > = jsonfile.readFileSync(
    path.resolve(process.cwd(), 'package.json'),
    'utf-8'
  );

  const rootPackgeDeps: Record<string, string> = {
    ...rootPackge.dependencies,
    ...rootPackge.devDependencies,
    ...rootPackge.peerDependencies,
  };

  for (const dep of deps) {
    const version = rootPackgeDeps[dep];
    depsInfoWithVersion[dep] = version;
  }

  return depsInfoWithVersion;
}
