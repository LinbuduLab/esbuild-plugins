import type { Plugin } from 'esbuild';
import fs from 'fs-extra';
import Svgr from '@svgr/core';

export interface Options {
  svgrConfig?: {
    configFile?: string;
    ext?: string;
    icon?: boolean;
    native?:
      | boolean
      | {
          expo: true;
        };
    typescript?: boolean;
    dimensions?: boolean;
    expandProps?: string;
    prettier?: boolean;
    svgo?: boolean;
    svgoConfig?: object;
    ref?: boolean;
    memo?: boolean;
    replaceAttrValues?: Record<string, string>[];
    svgProps?: Record<string, unknown>;
    titleProp?: boolean;
    template?: (...args: unknown[]) => unknown;
    outDir?: string;
    indexTemplate?: any;
    ignoreExisting?: boolean;
    filenameCase?: string;
  };
}

export default (options: Options = {}): Plugin => {
  const svgrConfig = options.svgrConfig ?? {};

  return {
    name: 'esbuild:svgr',
    setup(build) {
      build.onLoad({ filter: /\.svg$/ }, async (args) => {
        const content = fs.readFileSync(args.path, 'utf8');
        const svgr = await Svgr(content, svgrConfig);

        return {
          contents: svgr,
          loader: 'jsx',
        };
      });
    },
  };
};
