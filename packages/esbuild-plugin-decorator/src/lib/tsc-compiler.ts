import path from 'path';
import {
  ParsedCommandLine,
  transpileModule,
  findConfigFile,
  sys,
  CompilerOptions,
  TranspileOutput,
  parseConfigFileTextToJson,
  parseJsonConfigFileContent,
} from 'typescript';
import { printDiagnostics } from './log';

export function parseTsConfig(
  tsconfigPath: string,
  cwd: string
): ParsedCommandLine {
  // config file path >>> config file name
  const configFileName = findConfigFile(cwd, sys.fileExists, tsconfigPath);

  if (tsconfigPath !== undefined && !configFileName)
    throw new Error(`Failed to open '${configFileName}'`);

  let loadedConfig = {};
  let baseDir = cwd;

  if (configFileName) {
    const text = sys.readFile(configFileName, 'utf8');
    if (text === undefined)
      throw new Error(`Failed to read '${configFileName}'`);

    const result = parseConfigFileTextToJson(configFileName, text);

    if (result.error !== undefined) {
      printDiagnostics(result.error);
      throw new Error(`Failed to parse '${configFileName}'`);
    }

    loadedConfig = result.config;
    baseDir = path.dirname(configFileName);
  }

  const parsedTsConfig = parseJsonConfigFileContent(loadedConfig, sys, baseDir);

  if (parsedTsConfig.errors[0]) printDiagnostics(parsedTsConfig.errors);

  return parsedTsConfig;
}

// TODO: enhancement
export function tscCompiler(
  source: string,
  options: CompilerOptions
): TranspileOutput {
  const program = transpileModule(source, {
    compilerOptions: options,
  });

  return program;
}
