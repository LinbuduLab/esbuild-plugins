import execa from 'execa';
import { processEnv } from './env';

export function createExecaProcess(
  command: string,
  color: boolean,
  cwd: string
) {
  return new Promise((res, rej) => {
    const childProcess = execa(command, {
      env: processEnv(color),
      extendEnv: true,
      cwd,
      stdio: 'inherit',
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
  color: boolean,
  cwd: string
) {
  execa.sync(command, {
    extendEnv: true,
    env: processEnv(color),
    stdio: 'inherit',
    cwd,
  });
}
