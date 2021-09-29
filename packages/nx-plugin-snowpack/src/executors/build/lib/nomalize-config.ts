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
    root: options.absoluteRoot,
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
    mode: 'production' as const,
    // https://www.snowpack.dev/concepts/build-pipeline
    devOptions: {
      secure: false,
      port: 8080,
      output: 'dashboard',
      hmr: true,
      open: 'none',
    },
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
    root: options.absoluteRoot,
    workspaceRoot: options.workspaceRoot,
    mode: 'production' as const,
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
