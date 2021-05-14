import execa from 'execa';
import path from 'path';
import { from } from 'rxjs';

export default (cwd: string) => {
  process.env.UMI_PRESETS = require.resolve('@umijs/preset-dumi');
  process.env.APP_ROOT = path.resolve(cwd);

  const child = execa.node(require.resolve('umi/lib/forkedDev'), {
    stdio: 'inherit',
    cwd,
  });

  // handle exit signals
  child.on('exit', (code, signal) => {
    if (signal === 'SIGABRT') {
      process.exit(1);
    }

    process.exit(code);
  });

  // for e2e test
  child.on('message', (args) => {
    if (process.send) {
      process.send(args);
    }
  });

  process.on('SIGINT', () => {
    child.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    child.kill('SIGTERM');
  });

  return from(child);
};
