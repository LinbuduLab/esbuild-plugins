import path from 'path';
import { Plugin } from 'esbuild';
import fs from 'fs-extra';
import chalk from 'chalk';
import JSYaml, { LoadOptions as JSYamlOptions } from 'js-yaml';
import { TextDecoder } from 'util';

const debug = require('debug')('plugin:yaml');

export interface Options {
  jsyamlLoadOptions?: JSYamlOptions;
  transformParsed?: (
    data: string | number | object,
    filePath: string
  ) => object | undefined;
}

export default (options: Options = {}): Plugin => {
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
          new TextDecoder().decode(yamlContent),
          options?.jsyamlLoadOptions ?? {}
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
