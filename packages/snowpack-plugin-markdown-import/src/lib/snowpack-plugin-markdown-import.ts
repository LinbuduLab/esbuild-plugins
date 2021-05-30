import {
  SnowpackConfig,
  SnowpackPlugin,
  SnowpackPluginFactory,
} from 'snowpack';
import type { MarkedOptions } from 'marked';
import path from 'path';
import fs from 'fs-extra';
import marked from 'marked';
import { TextDecoder } from 'util';
import { sanitize as sanitizer, Config as SanitizeConfig } from 'dompurify';

export interface MDPluginOptions {
  markedOptions?: MarkedOptions;
  sanitize?: boolean;
  sanitizeOptions?: SanitizeConfig;
  exportAsJSON?: boolean;
  transformParsedResult?: (result: string) => string;
  transformRawBeforeParse?: (raw: string) => string;
}

export type AssetsPlugin = SnowpackPluginFactory<MDPluginOptions>;

export const snowpackPluginMDImport: AssetsPlugin = (
  snowpackConfig: SnowpackConfig,
  pluginOptions: MDPluginOptions
): SnowpackPlugin => {
  const {
    markedOptions = {},
    exportAsJSON = false,
    sanitize = false,
    sanitizeOptions = {},
  } = pluginOptions;

  const transformParsedResult = pluginOptions.transformParsedResult
    ? pluginOptions.transformParsedResult
    : (result: string) => result;

  const transformRawBeforeParse = pluginOptions.transformRawBeforeParse
    ? pluginOptions.transformRawBeforeParse
    : (raw: string) => raw;

  return {
    name: 'plugin:markdown',
    resolve: {
      input: ['.md'],
      output: [exportAsJSON ? '.json' : '.js'],
    },

    async load({ filePath }) {
      const markdownContent = transformRawBeforeParse(
        new TextDecoder().decode(fs.readFileSync(filePath))
      );

      const markdownHTML = marked(markdownContent, markedOptions);

      const transformedParsedHTML = transformParsedResult(markdownHTML);

      const result = {
        html: sanitize
          ? sanitizer(transformedParsedHTML, sanitizeOptions)
          : transformedParsedHTML,
        raw: markdownContent,
        fileName: path.basename(filePath),
      };

      return exportAsJSON
        ? JSON.stringify(result)
        : `export default ${JSON.stringify(result)}`;
    },
  };
};

export default snowpackPluginMDImport;
