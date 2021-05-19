import type { Plugin } from 'esbuild';
import type { MarkedOptions } from 'marked';

import path from 'path';
import fs from 'fs-extra';
import marked from 'marked';
import { promisify } from 'util';

import { TextDecoder } from 'util';

export interface Options {
  markedOptions?: MarkedOptions;
  sync?: boolean;
  extraJSONReturn?: Record<string, unknown>;
  transformParsedResult?: (result: string) => string;
  transformRawBeforeParse?: (raw: string) => string;
  transformRawAfterParse?: (raw: string) => string;
}

type AsyncMarked = (
  src: string,
  options: marked.MarkedOptions,
  callback: (error: any | undefined, parseResult: string) => void
) => void;

export default (options: Options = {}): Plugin => ({
  name: 'markdown',
  setup(build) {
    const sync = options.sync ?? true;
    const markedOptions = options.markedOptions ?? {};
    const extraJSONReturn = options.extraJSONReturn ?? {};
    const transformParsedResult = options.transformParsedResult
      ? options.transformParsedResult
      : (result: string) => result;

    const transformRawBeforeParse = options.transformRawBeforeParse
      ? options.transformRawBeforeParse
      : (raw: string) => raw;

    const transformRawAfterParse = options.transformRawAfterParse
      ? options.transformRawAfterParse
      : (raw: string) => raw;

    build.onResolve({ filter: /\.md$/ }, ({ path: filePath, resolveDir }) => {
      if (resolveDir === '') return;

      return {
        path: path.isAbsolute(filePath)
          ? filePath
          : path.join(resolveDir, filePath),
        namespace: 'markdown',
      };
    });

    build.onLoad(
      { filter: /.*/, namespace: 'markdown' },
      ({ path: filePath }) => {
        if (sync) {
          const markdownContent = transformRawBeforeParse(
            new TextDecoder().decode(fs.readFileSync(filePath))
          );

          const markdownHTML = marked(markdownContent, markedOptions);

          return {
            contents: JSON.stringify({
              html: transformParsedResult(markdownHTML),
              raw: transformRawAfterParse(markdownContent),
              filename: path.basename(filePath),
              ...extraJSONReturn,
            }),
            loader: 'json',
          };
        } else {
          fs.readFile(filePath).then((v) => {
            const markdownContent = transformRawBeforeParse(
              new TextDecoder().decode(v)
            );
            const promisifyMarked = promisify(marked as AsyncMarked);

            promisifyMarked(markdownContent, markedOptions).then((result) => {
              return {
                contents: JSON.stringify({
                  html: transformParsedResult(result),
                  raw: transformRawAfterParse(markdownContent),
                  filename: path.basename(filePath),
                  ...extraJSONReturn,
                }),
                loader: 'json',
              };
            });
          });
        }
      }
    );
  },
});
