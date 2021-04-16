import chalk from 'chalk';

export function devLog(str: string): void {
  process.env.NODE_ENV === 'development'
    ? console.log(chalk.green(str))
    : void 0;
}

export function devInfo(str: string): void {
  process.env.NODE_ENV === 'development'
    ? console.log(chalk.cyan(str))
    : void 0;
}

export function devWarn(str: string): void {
  process.env.NODE_ENV === 'development'
    ? console.log(chalk.yellow(str))
    : void 0;
}

export function devError(str: string): void {
  process.env.NODE_ENV === 'development' ? console.log(chalk.red(str)) : void 0;
}
