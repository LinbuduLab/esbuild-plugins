import type { BuildOptions } from 'esbuild';
import { register } from '@adonisjs/require-ts';

// TODO: normalize user config
export function normalizeESBuildExtendConfig(
  absoluteAppRoot: string,
  configPath: string
) {
  register(absoluteAppRoot, {
    cache: false,
  });

  const resolvedModule = require(configPath);

  return resolvedModule.default as BuildOptions;
}
