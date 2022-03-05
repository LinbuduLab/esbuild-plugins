import findUp from 'find-up';
import { CompilerOptions } from 'typescript';
import jsonfile from 'jsonfile';
import fs from 'fs-extra';

export function loadCompilerOptions(tsconfigPath?: string): CompilerOptions {
  if (!tsconfigPath) {
    const configPath = findUp.sync(['tsconfig.json']);
    if (configPath) {
      const config = jsonfile.readFileSync(configPath);
      return config['compilerOptions'] || {};
    }
  } else {
    if (fs.existsSync(tsconfigPath)) {
      const config = jsonfile.readFileSync(tsconfigPath);
      return config['compilerOptions'] || {};
    }
  }
}
