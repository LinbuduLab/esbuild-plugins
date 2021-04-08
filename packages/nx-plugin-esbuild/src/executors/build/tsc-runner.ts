import { Observable } from 'rxjs';
import { spawn, fork } from 'child_process';
import { build } from 'esbuild';
import watch from 'node-watch';

interface RunTscOptions {
  tsconfigPath: string;
  watch?: boolean;
  root?: string;
  useGlobal?: boolean;
}

export function runTSC({
  tsconfigPath,
  watch,
  root,
  useGlobal,
}: RunTscOptions) {
  return new Observable<{
    info?: string;
    error?: string;
    tscError?: Error;
    end?: string;
  }>((subscriber) => {
    // FIXME:
    const modeModulesPath =
      (root ? root + '/' : './') + 'node_modules/typescript/bin/';
    const command = `${modeModulesPath}tsc`;
    const args: string[] = ['--noEmit'];
    if (watch) {
      args.push('-w');
    }
    args.push(`-p ${tsconfigPath}`);

    let errorCount = 0;
    const child = spawn(command, args, { shell: true });

    // tsc是找到一个错误输出一次？
    child.stdout.on('data', (data) => {
      const decoded = data.toString();
      // eslint-disable-next-line no-control-regex
      if (decoded.match(/\x1Bc/g)) return;
      if (decoded.includes('error TS')) {
        errorCount++;
        subscriber.next({ error: decoded });
      } else {
        subscriber.next({ info: decoded });
      }
    });

    child.stderr.on('error', (tscError) => {
      subscriber.next({ tscError });
    });
    child.stdout.on('end', () => {
      subscriber.next({
        info: `Type check complete. Found ${errorCount} errors`,
      });
    });
  });
}
