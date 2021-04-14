import chalk from 'chalk';

export const pluginTitleContainer = (msg: string): string =>
  chalk.green.bold(msg);

export const timeStampContainer = (msg: string): string => chalk.green(msg);

export const buildTimesContainer = (msg: string): string =>
  chalk.gray.bold(msg);

export const successContainer = (msg: string): string => chalk.green(msg);

export const warningContainer = (msg: string): string => chalk.yellow(msg);

export const errorContainer = (msg: string): string => chalk.red(msg);

export const plainTextContainer = (msg: string): string => chalk.gray(msg);
