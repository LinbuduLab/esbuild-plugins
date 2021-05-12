import {
  createConfiguration,
  loadConfiguration,
  SnowpackUserConfig,
} from 'snowpack';
import path from 'path';
import { NormalizedSnowpackBuildSchema } from '../schema';

const defaultSnowpackBuildOptions = (
  options: NormalizedSnowpackBuildSchema
): SnowpackUserConfig => {
  return {
    root: options.absCwd,
    workspaceRoot: options.workspaceRoot,
    mode: 'production' as 'production',
    buildOptions: {
      // watch: options.watch,
      // out: options.outputPath,
      // clean: true,
      // baseUrl: options.absCwd,
      // relative to out
      // metaUrlPath: '_snowpack',
    },
    // optimize: {
    //   bundle: true,
    //   sourcemap: 'both',
    //   splitting: true,
    //   treeshake: true,
    //   manifest: true,
    //   minify: false,
    // },
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
