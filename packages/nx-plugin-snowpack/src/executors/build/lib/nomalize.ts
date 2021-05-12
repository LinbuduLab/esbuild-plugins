import {
  createConfiguration,
  loadConfiguration,
  startServer,
  build,
  SnowpackUserConfig,
  SnowpackConfig,
} from 'snowpack';
import { SnowpackBuildSchema } from '../schema';
import { all as merge } from 'deepmerge';
import { isPlainObject } from '../../../utils/is-plain-object';

export const createSnowpackConfig = (
  options: SnowpackBuildSchema,
  userConfig?: SnowpackConfig
) => {
  const config = createConfiguration({
    root: options.cwd,
    workspaceRoot: options.workspace,
    mount: {
      public: { url: options.mountRoot, static: true },
      src: { url: `${options.mountRoot}/dist` },
    },
    mode: 'production',
    devOptions: {
      port: 6666,
    },
    buildOptions: {
      watch: options.watch,
      out: options.outputPath,
    },
  });

  return config;
};

export const loadSnowpackConfig = (options: SnowpackBuildSchema) => {
  return loadConfiguration(
    {
      root: options.cwd,
      workspaceRoot: options.workspace,
      mount: {
        public: { url: options.mountRoot, static: true },
        src: { url: `${options.mountRoot}/dist` },
      },
      mode: 'production',
      devOptions: {
        port: 6666,
      },
      buildOptions: {
        watch: options.watch,
        out: options.outputPath,
      },
    },
    options.configPath
  );
};
