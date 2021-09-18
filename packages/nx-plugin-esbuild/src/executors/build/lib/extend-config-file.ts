import { NXESBuildConfigExport } from './types';
import { register } from '@adonisjs/require-ts';

export function normalizeESBuildExtendConfig(
  absoluteAppRoot: string,
  configPath: string
): NXESBuildConfigExport {
  register(absoluteAppRoot, {
    cache: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const resolvedModule = require(configPath);

  return resolvedModule.default as NXESBuildConfigExport;
}
