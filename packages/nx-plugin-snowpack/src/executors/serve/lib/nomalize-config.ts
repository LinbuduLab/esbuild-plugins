import {
  createConfiguration,
  loadConfiguration,
  SnowpackUserConfig,
} from 'snowpack';
import { NormalizedSnowpackServeSchema } from '../schema';

const defaultSnowpackServeOptions = (
  options: NormalizedSnowpackServeSchema
): SnowpackUserConfig => {
  return {
    root: options.absCwd,
    workspaceRoot: options.workspaceRoot,
    mode: 'development' as 'development',
    devOptions: {
      secure: false,
      port: 9797,
      output: 'dashboard',
      // hmr: true,
      // hmrDelay: 100,
    },
  };
};

export const createSnowpackConfig = (
  options: NormalizedSnowpackServeSchema
) => {
  const config = createConfiguration(defaultSnowpackServeOptions(options));
  return config;
};

export const loadSnowpackConfig = (options: NormalizedSnowpackServeSchema) => {
  return loadConfiguration(
    defaultSnowpackServeOptions(options),
    options.configPath
  );
};
