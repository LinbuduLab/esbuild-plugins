import chalk from 'chalk';
import { inspect } from 'util';

export function printDiagnostics(...args: any[]) {
  console.log(inspect(args, false, 10, true));
}

export const pluginTitle = (): string =>
  chalk.bold.green('esbuild-plugin-decorator');

export const info = (text: string): string => chalk.cyan(text);

export const warn = (text: string): string => chalk.yellow(text);

export const err = (text: string): string => chalk.red(text);
