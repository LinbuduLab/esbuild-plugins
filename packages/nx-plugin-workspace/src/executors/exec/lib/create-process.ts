import execa from 'execa';
import chalk from 'chalk';
import consola from 'consola';
import { processEnv } from './env';
import type { NormalizedExecSchema } from './types';

export function createExecaProcess(
  command: string,
  cwd: string,
  { color, shell, useLocalPackage }: NormalizedExecSchema
) {
  return new Promise((res, rej) => {
    consola.info(
      `${chalk.bgBlue(
        chalk.white(chalk.bold('[ASYNC]'))
      )} Executing command: ${chalk.white(command)}`
    );
    const childProcess = execa(command, {
      env: processEnv(color),
      extendEnv: true,
      cwd,
      stdio: 'inherit',
      preferLocal: useLocalPackage,
      shell,
    });

    const processExitListener = () => childProcess.kill();
    process.on('exit', processExitListener);
    process.on('SIGTERM', processExitListener);

    childProcess.on('exit', () => {
      res(childProcess.exitCode === 0);
    });

    childProcess.on('error', (error) => {
      res(false);
      throw error;
    });
  });
}

export function createSyncExecaProcess(
  command: string,
  cwd: string,
  { color, shell, useLocalPackage }: NormalizedExecSchema
) {
  consola.info(
    `${chalk.bgBlue(
      chalk.white(chalk.bold('[SYNC]'))
    )} Executing command: ${chalk.white(command)}`
  );
  execa.sync(command, {
    extendEnv: true,
    env: processEnv(color),
    stdio: 'inherit',
    cwd,
    preferLocal: useLocalPackage,
    shell,
  });
}
