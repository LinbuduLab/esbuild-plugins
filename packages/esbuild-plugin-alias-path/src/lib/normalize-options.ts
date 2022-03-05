import fs from 'fs-extra';
import path from 'path';

export interface Options {
  alias?: Record<string, string>;
  skip?: boolean;
  cwd?: string;
}

export interface NormalizedOptions extends Required<Options> {
  [key: string]: unknown;
}

export function normalizeOption(options: Options = {}): NormalizedOptions {
  const alias = options.alias ?? {};
  const cwd = options.cwd ?? process.cwd();

  for (const [k, v] of Object.entries(alias)) {
    if (fs.statSync(v).isDirectory()) {
      fs.readdirSync(v).forEach((file) => {
        const replacedKey = k.replace(
          '*',
          file.replace(path.extname(file), '')
        );

        !alias[replacedKey]
          ? (alias[replacedKey] = path.join(v, file))
          : void 0;
      });

      delete alias[k];
    }
  }

  const shouldSkipThisPlugin = options.skip ?? !Object.keys(alias).length;

  return {
    alias,
    skip: shouldSkipThisPlugin,
    cwd,
  };
}
