import {
  createConfiguration,
  loadConfiguration,
  SnowpackUserConfig,
} from 'snowpack';

import { NormalizedSnowpackServeSchema } from '../schema';

export const defaultSnowpackOptions = (
  options: NormalizedSnowpackServeSchema
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
    mode: 'development' as 'development',
    devOptions: {
      secure: false,
      port: 8080,
      output: 'dashboard',
      hmr: true,
      open: options.open,
    },
  };
};

// FIXME: config here will override snowpack.config.js
// https://github.com/snowpackjs/snowpack/issues/3376
const defaultSnowpackServeOptions = (
  options: NormalizedSnowpackServeSchema
): SnowpackUserConfig => {
  return {
    root: options.absCwd,
    // 同一键名不会覆盖，并且这里的优先级更高
    // 所以默认不会启用
    // mount: {
    //   // http://localhost:9797/dist/index.js
    //   src: {
    //     url: '/dist',
    //     static: false,
    //     resolve: true,
    //   },
    //   // http://localhost:9797/robots.txt
    //   public: {
    //     url: '/',
    //     static: true,
    //     resolve: false,
    //   },
    // },
    // exclude: ['**/node_modules/**'],
    workspaceRoot: options.workspaceRoot,
    mode: 'development' as 'development',
    // devOptions: {
    //   secure: false,
    //   port: 9797,
    //   output: 'dashboard',
    //   hmr: true,
    // },
  };
};

export const createSnowpackConfig = (
  options: NormalizedSnowpackServeSchema
) => {
  const config = createConfiguration(defaultSnowpackOptions(options));
  return config;
};

export const loadSnowpackConfig = (options: NormalizedSnowpackServeSchema) => {
  return loadConfiguration(
    defaultSnowpackServeOptions(options),
    options.configPath
  );
};
