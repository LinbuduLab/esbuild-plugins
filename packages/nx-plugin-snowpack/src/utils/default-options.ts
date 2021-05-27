import {
  createConfiguration,
  loadConfiguration,
  SnowpackUserConfig,
} from 'snowpack';
import path from 'path';
import { NormalizedSnowpackSharedSchema } from './types';

export const defaultSnowpackOptions = (
  options: NormalizedSnowpackSharedSchema
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
    devOptions: {
      secure: false,
      port: 8080,
      output: 'dashboard',
      hmr: true,
    },
    buildOptions: {},
    optimize: {
      bundle: true,
      sourcemap: 'both',
      splitting: true,
      treeshake: true,
      manifest: true,
      minify: false,
    },
  };
};
