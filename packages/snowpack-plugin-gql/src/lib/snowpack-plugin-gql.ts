import {
  SnowpackConfig,
  SnowpackPlugin,
  SnowpackPluginFactory,
  logger,
} from 'snowpack';

export interface GqlPluginOptions {
  __prop__: unknown;
}

export type GqlPlugin = SnowpackPluginFactory<GqlPluginOptions>;

export const snowpackPluginGql: GqlPlugin = (
  snowpackConfig: SnowpackConfig,
  pluginOptions: GqlPluginOptions
): SnowpackPlugin => {
  return {
    name: 'plugin:Gql',
    resolve: {
      input: [],
      output: [],
    },
    async transform(options) {
      console.log('options: ', options);
    },
    async load({ filePath, isDev, fileExt }) {},
    async run(options) {},
    async optimize(options) {},
    async cleanup() {},
    knownEntrypoints: [],
    config(config) {},
    onChange({ filePath }) {},
  };
};
