import {
  SnowpackConfig,
  SnowpackPlugin,
  SnowpackPluginFactory,
} from 'snowpack';

export interface AssetsPluginOptions {
  test: string;
}

export type AssetsPlugin = SnowpackPluginFactory<AssetsPluginOptions>;

export const snowpackPluginAssets: AssetsPlugin = (
  snowpackConfig: SnowpackConfig,
  pluginOptions: AssetsPluginOptions
): SnowpackPlugin => {
  return {
    name: 'plugin:assets',
    resolve: {
      input: [],
      output: [],
    },
    async transform(options) {
      console.log('options: ', options);
    },
    // 当output存在多项时，load应当返回extension map形式
    // 如 (e.g. { ".js": "[code]", ".css": "[code]" })
    // 对应的output ['.js', '.css']
    // 源文件只会被第一个声明了input的load方法处理
    // 但是每个transform方法都能拿到
    // 如果load方法没有返回值 那么file就不会被这个load处理
    async load({ filePath, isDev, fileExt }) {},
    async run(options) {},
    // 供build-only的库使用，会在build后执行
    async optimize(options) {},
    async cleanup() {},
    knownEntrypoints: [],
    config(config) {},
    onChange({ filePath }) {},
  };
};
