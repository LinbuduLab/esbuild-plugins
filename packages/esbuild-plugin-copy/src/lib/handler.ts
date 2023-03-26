import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';

import { verboseLog } from './utils';

/**
 *
 * @param outDirResolveFrom the base destination dir that will resolve with asset.to value
 * @param rawFromPath the original asset.from value from user config
 * @param globbedFromPath the globbed file from path, which are globbed from rawFromPath
 * @param baseToPath the original asset.to value from user config, which will be resolved with outDirResolveFrom option
 * @param verbose verbose logging
 * @param dryRun dry run mode
 * @returns
 */
export function copyOperationHandler(
  outDirResolveFrom: string,
  rawFromPath: string[],
  globbedFromPath: string,
  baseToPath: string,

  verbose = false,
  dryRun = false
) {
  for (const rawFrom of rawFromPath) {
    // only support from dir like: /**/*(.ext)
    const { dir } = path.parse(rawFrom);

    // be default, when ends with /*, glob doesnot expand directories
    // avoid use override option `expandDirectories` and use `/*`

    // if from path ends with /* like assets/* or assets/*.ext, we give a warning?
    if (!dir.endsWith('/**')) {
      verboseLog(
        `The from path ${chalk.white(
          rawFromPath
        )} of current asset pair doesnot ends with ${chalk.white(
          '/**/*(.ext)'
        )}, `,
        verbose
      );
    }

    // only works for /**/*(.ext) pattern
    // ./assets/** → ./assets
    const startFragment = dir.replace(`/**`, '');

    // globbedFromPath: /PATH/TO/assets/foo.js → /foo.js
    // globbedFromPath: /PATH/TO/assets/nest/foo.js → /nest/foo.js
    const [, preservedDirStructure] = globbedFromPath.split(startFragment);

    // /PATH/TO/assets/foo.js
    // path.resolve seems to be unnecessary as globbed path is already absolute path
    const sourcePath = path.resolve(globbedFromPath);

    const isToPathDir = path.extname(baseToPath) === '';

    const composedDistDirPath = isToPathDir
      ? // /RESOLVE_FROM_DIR/SPECIFIED_TO_DIR/LEFT_FILE_STRUCTURE
        path.resolve(
          // base resolve destination dir
          outDirResolveFrom,
          // configures destination dir
          baseToPath,
          // internal dir structure, remove the first slash
          preservedDirStructure.slice(1)
        )
      : path.resolve(
          // base resolve destination dir
          outDirResolveFrom,
          // configures destination dir
          baseToPath
        );

    dryRun ? void 0 : fs.ensureDirSync(path.dirname(composedDistDirPath));

    dryRun ? void 0 : fs.copyFileSync(sourcePath, composedDistDirPath);

    verboseLog(
      `${dryRun ? chalk.white('[DryRun] ') : ''}File copied: ${chalk.white(
        sourcePath
      )} -> ${chalk.white(composedDistDirPath)}`,
      verbose
    );
  }
}
