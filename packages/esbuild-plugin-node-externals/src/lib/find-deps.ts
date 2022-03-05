import { NormalizedESBuildPluginNodeExternalsOptions } from './normalize-options';
import jsonfile from 'jsonfile';

export const collectDepsToExclude = (
  options: NormalizedESBuildPluginNodeExternalsOptions
): string[] => {
  const depKeys: string[] = [
    options.withDeps ? 'dependencies' : undefined,
    options.withDevDeps ? 'devDependencies' : undefined,
    options.withPeerDeps ? 'peerDependencies' : undefined,
    options.withOptDeps ? 'optionalDependencies' : undefined,
  ].filter((item) => !!item);

  // [{'project/package.json'}]
  // [['chalk']]
  return options.packagePaths
    .map((packagePath) => {
      let parsedPackageJsonData: Record<string, string>;
      try {
        parsedPackageJsonData = jsonfile.readFileSync(packagePath, {
          encoding: 'utf-8',
        });
      } catch (error) {
        console.error(error);
        throw new Error(
          `Couldn't process ${packagePath}". Make sure it's a valid JSON.`
        );
      }

      // ['dependencies']
      return (
        depKeys
          .map((key) =>
            // [{ 'chalk': "latest" }]
            parsedPackageJsonData[key]
              ? // [[{ 'chalk' }]]
                Object.keys(parsedPackageJsonData[key])
              : []
          )
          // [{ 'chalk'}]
          .flat()
          // exclude package which are specified as included
          .filter((packageName) => !options.include.includes(packageName))
      );
    })
    .flat();
};
