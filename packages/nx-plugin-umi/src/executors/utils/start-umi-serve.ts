import execa from 'execa';
import { from } from 'rxjs';

// TODO: umi fork inspect utils
// TODO: execa options
export const startUmiServe = (cwd: string) => {
  const forkedDevProcess = execa.node(require.resolve('umi/lib/forkedDev'), {
    cwd,
    stdio: 'inherit',
  });

  process.on('SIGINT', () => {
    forkedDevProcess.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    forkedDevProcess.kill('SIGTERM');
    process.exit(1);
  });

  forkedDevProcess.on('message', (msg) => {
    console.log('msg: ', msg);
  });

  return from(forkedDevProcess);
};
