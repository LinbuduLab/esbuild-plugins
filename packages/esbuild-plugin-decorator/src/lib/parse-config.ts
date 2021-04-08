import path from 'path';
import {
  findConfigFile,
  sys,
  parseConfigFileTextToJson,
  parseJsonConfigFileContent,
} from 'typescript';
import { printDiagnostics } from './log';

export function parseTsConfig(tsconfigPath: string, cwd: string) {
  // path >>> name
  const fileName = findConfigFile(cwd, sys.fileExists, tsconfigPath);

  // if the value was provided, but no file, fail hard
  if (tsconfigPath !== undefined && !fileName)
    throw new Error(`Failed to open '${fileName}'`);

  let loadedConfig = {};
  let baseDir = cwd;

  if (fileName) {
    const text = sys.readFile(fileName);
    if (text === undefined) throw new Error(`Failed to read '${fileName}'`);

    const result = parseConfigFileTextToJson(fileName, text);

    if (result.error !== undefined) {
      printDiagnostics(result.error);
      throw new Error(`Failed to parse '${fileName}'`);
    }

    loadedConfig = result.config;
    baseDir = path.dirname(fileName);
  }

  const parsedTsConfig = parseJsonConfigFileContent(loadedConfig, sys, baseDir);

  if (parsedTsConfig.errors[0]) printDiagnostics(parsedTsConfig.errors);

  return parsedTsConfig;
}
