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
  // D://PROJECT/apps/app1/tsconfig.app.json
  const configFileName = findConfigFile(cwd, sys.fileExists, tsconfigPath);

  if (tsconfigPath !== undefined && !configFileName)
    throw new Error(`Failed to open '${configFileName}'`);

  let loadedConfig = {};
  let baseDir = cwd;

  if (configFileName) {
    // plain json text of file content
    const text = sys.readFile(configFileName, 'utf8');
    if (text === undefined)
      throw new Error(`Failed to read '${configFileName}'`);

    // config: parsed json content
    const result = parseConfigFileTextToJson(configFileName, text);

    if (result.error !== undefined) {
      printDiagnostics(result.error);
      throw new Error(`Failed to parse '${configFileName}'`);
    }

    loadedConfig = result.config;
    // D://PROJECT/apps/app1
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
