import { Plugin } from 'rollup';

import { terser as terserPlugin } from 'rollup-plugin-terser';
import fileSizePlugin from 'rollup-plugin-filesize';
import typescriptPlugin from 'rollup-plugin-typescript2';
import esbuildPlugin from 'rollup-plugin-esbuild';
import aliasPlugin from '@rollup/plugin-alias';
import babelPlugin from '@rollup/plugin-babel';
import commonjsPlugin from '@rollup/plugin-commonjs';
import nodeResolvePlugin from '@rollup/plugin-node-resolve';
import replacePlugin from '@rollup/plugin-replace';
import runPlugin from '@rolluP/plugin-run';
import { DEFAULT_EXTENSIONS } from '@babel/core';

export const getPresetPlugins = (
  cwd: string,
  entry: string,
  tsconfig: string,
  outputPath: string,
  minify: boolean,
  alias: Record<string, string>,
  replacement: Record<string, string | ((...args: unknown[]) => string)>,
  extraCompiler: 'esbuild' | 'swc' | 'none',
  executeImmediately: boolean
): Plugin[] => {
  const presetPlugins: Plugin[] = [
    aliasPlugin({ entries: alias }),

    replacePlugin({
      values: replacement,
      preventAssignment: true,
    }),

    commonjsPlugin(),

    nodeResolvePlugin(),

    typescriptPlugin({
      cwd,
      tsconfig,
      check: true,
      verbosity: 2,
      clean: true,
      abortOnError: true,
    }),

    babelPlugin({
      extensions: [...DEFAULT_EXTENSIONS, 'ts', 'tsx'],
      babelHelpers: 'runtime',
    }),
  ];

  if (extraCompiler === 'esbuild') {
    presetPlugins.push(
      esbuildPlugin({
        minify,
        target: 'es2015',
        tsconfig,
      })
    );
  }

  if (executeImmediately) {
    presetPlugins.push(runPlugin());
  }

  if (minify) {
    presetPlugins.push(
      terserPlugin({
        format: {
          comments: 'all',
          ie8: false,
        },
      })
    );
  }

  return presetPlugins;
};
