import fs from 'fs/promises';
import path from 'path';
import { inspect } from 'util';
import type { Plugin } from 'esbuild';
import {
  ParsedCommandLine,
  transpileModule,
  findConfigFile,
  sys,
  parseConfigFileTextToJson,
  parseJsonConfigFileContent,
} from 'typescript';

import stripComments from 'strip-comments';

import { BuildExecutorSchema } from './schema';

export default async function runExecutor(options: BuildExecutorSchema) {
  console.log('Executor ran for Build', options);
  return {
    success: true,
  };
}

const theFinder = new RegExp(
  /((?<![(\s]\s*['"])@\w*[\w\d]\s*(?![;])[((?=\s)])/
);

const findDecorators = (fileContent: string) =>
  theFinder.test(stripComments(fileContent));

export type PluginOptions = Record<string, unknown>;

const esbuildPluginTsc = (options: PluginOptions = {}): Plugin => ({
  name: 'tsc',
  setup(build) {
    const tsconfigPath =
      options.tsconfigPath ?? path.join(process.cwd(), './tsconfig.json');
    const forceTsc = options.force ?? false;
    const tsx = options.tsx ?? true;

    let parsedTsConfig = null;

    build.onLoad({ filter: tsx ? /\.tsx?$/ : /\.ts$/ }, async (args) => {
      if (!parsedTsConfig) {
        parsedTsConfig = parseTsConfig(tsconfigPath, process.cwd());
        if (parsedTsConfig.sourcemap) {
          parsedTsConfig.sourcemap = false;
          parsedTsConfig.inlineSources = true;
          parsedTsConfig.inlineSourceMap = true;
        }
      }

      // Just return if we don't need to search the file.
      if (
        !forceTsc &&
        (!parsedTsConfig ||
          !parsedTsConfig.options ||
          !parsedTsConfig.options.emitDecoratorMetadata)
      ) {
        return;
      }

      const ts = await fs.readFile(args.path, 'utf8');
      // .catch((err) => printDiagnostics({ file: args.path, err }));

      // Find the decorator and if there isn't one, return out
      const hasDecorator = findDecorators(ts);
      if (!hasDecorator) {
        return;
      }

      const program = transpileModule(ts, parsedTsConfig);
      return { contents: program.outputText };
    });
  },
});

function parseTsConfig(tsconfig, cwd = process.cwd()) {
  const fileName = findConfigFile(cwd, sys.fileExists, tsconfig);

  // if the value was provided, but no file, fail hard
  if (tsconfig !== undefined && !fileName)
    throw new Error(`failed to open '${fileName}'`);

  let loadedConfig = {};
  let baseDir = cwd;
  let configFileName;
  if (fileName) {
    const text = sys.readFile(fileName);
    if (text === undefined) throw new Error(`failed to read '${fileName}'`);

    const result = parseConfigFileTextToJson(fileName, text);

    if (result.error !== undefined) {
      printDiagnostics(result.error);
      throw new Error(`failed to parse '${fileName}'`);
    }

    loadedConfig = result.config;
    baseDir = path.dirname(fileName);
    configFileName = fileName;
  }

  const parsedTsConfig = parseJsonConfigFileContent(loadedConfig, sys, baseDir);

  if (parsedTsConfig.errors[0]) printDiagnostics(parsedTsConfig.errors);

  return parsedTsConfig;
}

function printDiagnostics(...args) {
  console.log(inspect(args, false, 10, true));
}
