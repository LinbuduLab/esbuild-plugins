import chalk from 'chalk';

export const pluginTitle = (msg: string): string => chalk.green.bold(msg);

export const timeStamp = (msg: string): string => chalk.green(msg);

export const buildTimes = (msg: string): string => chalk.gray.bold(msg);

export const success = (msg: string): string => chalk.green(msg);

export const warning = (msg: string): string => chalk.yellow(msg);

export const error = (msg: string): string => chalk.red(msg);

export const plainText = (msg: string): string => chalk.gray(msg);

export const info = (msg: string): string => chalk.cyan(msg);
