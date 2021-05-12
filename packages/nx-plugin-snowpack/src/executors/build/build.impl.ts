import { ExecutorContext } from '@nrwl/devkit';
import { SnowpackBuildSchema } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { map, tap } from 'rxjs/operators';
import { SnowpackConfig } from 'snowpack';
import path from 'path';
import fs from 'fs-extra';
import { builder } from './lib/watch-build';

export default function runExecutor(
  options: SnowpackBuildSchema,
  context: ExecutorContext
) {
  let snowpackConfigFileContent = {} as SnowpackConfig;

  // TODO: support loadConfiguration
  // if (
  //   options.configPath &&
  //   fs.existsSync(path.resolve(options.cwd, options.configPath))
  // ) {
  //   snowpackConfigFileContent = require(path.resolve(
  //     options.cwd,
  //     options.configPath
  //   ));
  // }

  return eachValueFrom(
    builder(options, snowpackConfigFileContent).pipe(
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
