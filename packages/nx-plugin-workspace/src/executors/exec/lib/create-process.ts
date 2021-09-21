import execa from 'execa';
import { processEnv } from './env';

export function createExecaProcess(
  command: string,
  color: boolean,
  useLocalPackage: boolean,
  cwd: string,
  shell: boolean
) {
  return new Promise((res, rej) => {
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
  color: boolean,
  useLocalPackage: boolean,
  cwd: string,
  shell: boolean
) {
  execa.sync(command, {
    extendEnv: true,
    env: processEnv(color),
    stdio: 'inherit',
    cwd,
    preferLocal: useLocalPackage,
    shell,
  });
}
