import {
  createConfiguration,
  loadConfiguration,
  SnowpackUserConfig,
} from 'snowpack';
import { NormalizedSnowpackBuildSchema } from '../schema';

export const defaultSnowpackOptions = (
  options: NormalizedSnowpackBuildSchema
): SnowpackUserConfig => {
  return {
    root: options.absCwd,
    // 同一键名不会覆盖，并且这里的优先级更高
    // 所以默认不会启用
    mount: {
      // http://localhost:9797/dist/index.js
      src: {
        url: '/dist',
        static: false,
        resolve: true,
      },
      // http://localhost:9797/robots.txt
      public: {
        url: '/',
        static: true,
        resolve: false,
      },
    },
    exclude: ['**/node_modules/**'],
    workspaceRoot: options.workspaceRoot,
    mode: 'production' as 'production',
    buildOptions: {
      watch: options.watch,
      clean: options.clean,
    },
    optimize: {
      bundle: true,
      sourcemap: 'both',
      splitting: true,
      treeshake: true,
      manifest: true,
      minify: true,
    },
  };
};

const defaultSnowpackBuildOptions = (
  options: NormalizedSnowpackBuildSchema
): SnowpackUserConfig => {
  return {
    root: options.absCwd,
    workspaceRoot: options.workspaceRoot,
    mode: 'production' as 'production',
  };
};

export const createSnowpackConfig = (
  options: NormalizedSnowpackBuildSchema
) => {
  const config = createConfiguration(defaultSnowpackOptions(options));

  return config;
};

export const loadSnowpackConfig = (options: NormalizedSnowpackBuildSchema) => {
  return loadConfiguration(
    defaultSnowpackBuildOptions(options),
    options.configPath
  );
};
