import {
  createConfiguration,
  loadConfiguration,
  startServer,
  build,
  SnowpackUserConfig,
  SnowpackConfig,
} from 'snowpack';
import { SnowpackServeSchema } from '../schema';
import { all as merge } from 'deepmerge';
import { isPlainObject } from '../../../utils/is-plain-object';

export const createSnowpackConfig = (
  options: SnowpackServeSchema,
  userConfig?: SnowpackConfig
) => {
  const config = createConfiguration({
    root: options.cwd,
    workspaceRoot: options.workspace,
    mount: {
      public: { url: options.mountRoot, static: true },
      src: { url: `${options.mountRoot}/dist` },
    },
    mode: 'development',
    devOptions: {
      // port: 6666,
    },
  });

  return config;
};

export const loadSnowpackConfig = (options: SnowpackServeSchema) => {
  return loadConfiguration(
    {
      root: options.cwd,
      workspaceRoot: options.workspace,
      mount: {
        public: { url: options.mountRoot, static: true },
        src: { url: `${options.mountRoot}/dist` },
      },
      mode: 'development',
      devOptions: {
        // port: 6666,
      },
    },
    options.configPath
  );
};
