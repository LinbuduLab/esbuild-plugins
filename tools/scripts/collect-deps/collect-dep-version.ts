import path from 'path';
import jsonfile from 'jsonfile';
import pacote from 'pacote';

export async function collectDepsVersion(deps: string[]) {
  const depsInfoWithVersion: Record<string, string> = {};

  for (const dep of deps) {
    const manifest = await pacote.manifest(dep);
    const version = manifest.version;
    depsInfoWithVersion[dep] = `~${version}`;
  }

  return depsInfoWithVersion;
}

export function collectDepsVersionFromRootPackage(deps: string[]) {
  const depsInfoWithVersion: Record<string, string> = {};

  const rootPackge: Record<
    'dependencies' | 'devDependencies' | 'peerDependencies',
    Record<string, string>
  > = jsonfile.readFileSync(
    path.resolve(process.cwd(), 'package.json'),
    'utf8'
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
