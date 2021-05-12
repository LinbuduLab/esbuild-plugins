import {
  createConfiguration,
  loadConfiguration,
  SnowpackUserConfig,
} from 'snowpack';
import { NormalizedSnowpackServeSchema } from '../schema';

const defaultSnowpackBuildOptions = (
  options: NormalizedSnowpackServeSchema
): SnowpackUserConfig => {
  return {
    root: options.cwd,
    workspaceRoot: options.workspaceRoot,
    mode: 'development' as 'development',
    devOptions: {
      secure: false,
      port: 9797,
      output: 'dashboard',
      hmr: true,
      hmrDelay: 100,
    },
  };
};

export const createSnowpackConfig = (
  options: NormalizedSnowpackServeSchema
) => {
  const config = createConfiguration(defaultSnowpackBuildOptions(options));
  return config;
};

export const loadSnowpackConfig = (options: NormalizedSnowpackServeSchema) => {
  return loadConfiguration(
    defaultSnowpackBuildOptions(options),
    options.configPath
  );
};
