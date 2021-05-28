import {
  SnowpackConfig,
  SnowpackPlugin,
  SnowpackPluginFactory,
} from 'snowpack';
import type { MarkedOptions } from 'marked';
import path from 'path';
import fs from 'fs-extra';
import frontMatter from 'front-matter';
import marked from 'marked';
import { promisify, TextDecoder } from 'util';

// front matter
// json?
// extra output(suffix)
// extra output configs
// skip empty

export interface MDPluginOptions {
  markedOptions?: MarkedOptions;
  sanitize?: boolean;
  frontMatter?: boolean;
  transformParsedResult?: (result: string) => string;
  transformRawBeforeParse?: (raw: string) => string;
  transformRawAfterParse?: (raw: string) => string;
}

export type AssetsPlugin = SnowpackPluginFactory<MDPluginOptions>;

export const snowpackPluginMDImport: AssetsPlugin = (
  snowpackConfig: SnowpackConfig,
  pluginOptions: MDPluginOptions
): SnowpackPlugin => {
  const { markedOptions = {}, sanitize = false } = pluginOptions;

  const transformParsedResult = pluginOptions.transformParsedResult
    ? pluginOptions.transformParsedResult
    : (result: string) => result;

  const transformRawBeforeParse = pluginOptions.transformRawBeforeParse
    ? pluginOptions.transformRawBeforeParse
    : (raw: string) => raw;

  const transformRawAfterParse = pluginOptions.transformRawAfterParse
    ? pluginOptions.transformRawAfterParse
    : (raw: string) => raw;

  return {
    name: 'plugin:markdown',
    resolve: {
      input: ['.md'],
      output: ['.js'],
    },

    async load({ filePath }) {
      const markdownContent = transformRawBeforeParse(
        new TextDecoder().decode(fs.readFileSync(filePath))
      );

      const markdownHTML = marked(markdownContent, markedOptions);

      const result = {
        html: transformParsedResult(markdownHTML),
        raw: transformRawAfterParse(markdownContent),
        fileName: path.basename(filePath),
        props: {},
      };

      return `export default ${JSON.stringify(result)}`;
    },

    async optimize(options) {},

    knownEntrypoints: [],
    config(config) {},
  };
};

export default snowpackPluginMDImport;
