import { NXESBuildConfigExport } from './types';
import { register } from '@adonisjs/require-ts';

export function normalizeESBuildExtendConfig(
  absoluteAppRoot: string,
  configPath: string
): NXESBuildConfigExport {
  register(absoluteAppRoot, {
    cache: false,
  });

  const resolvedModule = require(configPath);

  return resolvedModule.default as NXESBuildConfigExport;
}
