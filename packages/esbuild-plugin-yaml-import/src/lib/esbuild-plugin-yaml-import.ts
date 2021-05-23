import path from 'path';
import { Plugin } from 'esbuild';
import fs from 'fs-extra';
import JSYaml, { LoadOptions as JSYamlOptions } from 'js-yaml';
import { TextDecoder } from 'util';

export interface Options {
  jsyamlLoadOptions?: JSYamlOptions;

  transformContent?: (content: string) => string;

  transformParsed?: (
    data: string | number | object,
    filePath: string
  ) => object | undefined;
}

export default (options: Options = {}): Plugin => {
  const loadOptions = options.jsyamlLoadOptions ?? {};
  const transformContent = options.transformContent
    ? options.transformContent
    : (content: string) => content;

  return {
    name: 'esbuild:yaml',
    setup({ onResolve, onLoad }) {
      onResolve({ filter: /\.(yml|yaml)$/ }, (args) => {
        if (args.resolveDir === '') return;

        return {
          path: path.isAbsolute(args.path)
            ? args.path
            : path.join(args.resolveDir, args.path),
          namespace: 'yaml',
        };
      });

      onLoad({ filter: /.*/, namespace: 'yaml' }, (args) => {
        const yamlContent = fs.readFileSync(args.path);

        let parsed = JSYaml.load(
          transformContent(new TextDecoder().decode(yamlContent)),
          loadOptions
        );

        if (options?.transformParsed)
          parsed = options.transformParsed(parsed, args.path) ?? parsed;

        return {
          contents: JSON.stringify(parsed),
          loader: 'json',
        };
      });
    },
  };
};
