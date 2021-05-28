import execa, { SyncOptions as ExecaOptions } from 'execa';
import {
  SnowpackConfig,
  SnowpackPlugin,
  SnowpackPluginFactory,
  logger,
} from 'snowpack';

export interface ServePluginOptions {
  execaOptions?: ExecaOptions;
  serveArgs?: string[];
}

export type ServePlugin = SnowpackPluginFactory<ServePluginOptions>;

const snowpackPluginServe: ServePlugin = (
  snowpackConfig: SnowpackConfig,
  pluginOptions: ServePluginOptions
): SnowpackPlugin => {
  const { execaOptions = {}, serveArgs = ['-s'] } = pluginOptions;

  return {
    name: 'plugin:serve',
    async optimize(options) {
      logger.info('serve plugin started', {
        name: 'plugin:serve',
      });

      logger.info(
        `serve plugin commands: serve ${serveArgs.join(' ')} ${
          options.buildDirectory
        }`,
        {
          name: 'plugin:serve',
        }
      );

      const executor = () => {
        execa.sync('serve', [...serveArgs, options.buildDirectory], {
          stdio: 'inherit',
          preferLocal: true,
          ...execaOptions,
        });
      };

      executor();
    },
  };
};

export default snowpackPluginServe;
