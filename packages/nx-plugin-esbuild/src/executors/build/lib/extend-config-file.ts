import { NXESBuildConfigExport } from './types';
import { register } from '@adonisjs/require-ts';
import consola from 'consola';
import chalk from 'chalk';

export function normalizeESBuildExtendConfig(
  absoluteAppRoot: string,
  configPath: string,
  verbose: boolean
): NXESBuildConfigExport {
  try {
    register(absoluteAppRoot, {
      cache: false,
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const resolvedModule = require(configPath);

    return resolvedModule.default as NXESBuildConfigExport;
  } catch (error) {
    verbose && consola.error(error);
    consola.warn(
      `Reading config file ${chalk.yellow(configPath)} failed, skipped.`
    );
  }
}
