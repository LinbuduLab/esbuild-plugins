import { createConfiguration, loadConfiguration } from 'snowpack';
import { NormalizedSnowpackBuildSchema } from '../schema';

const defaultSnowpackBuildOptions = (
  options: NormalizedSnowpackBuildSchema
) => {
  return {
    root: options.cwd,
    workspaceRoot: options.workspaceRoot,
    mode: 'production' as 'production',
    buildOptions: {
      watch: options.watch,
      out: options.outputPath,
    },
  };
};

export const createSnowpackConfig = (
  options: NormalizedSnowpackBuildSchema
) => {
  const config = createConfiguration(defaultSnowpackBuildOptions(options));

  return config;
};

export const loadSnowpackConfig = (options: NormalizedSnowpackBuildSchema) => {
  return loadConfiguration(
    defaultSnowpackBuildOptions(options),
    options.configPath
  );
};
