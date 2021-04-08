import { Observable } from 'rxjs';
import { spawn, fork } from 'child_process';
import { build } from 'esbuild';
import path from 'path';
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
    const modeModulesPath = path.join(root, 'node_modules', '.bin', 'tsc');

    const command = `${modeModulesPath}`;

    const args: string[] = ['--noEmit'];
    if (watch) {
      args.push('-w');
    }
    args.push('-p');
    args.push(tsconfigPath);

    let errorCount = 0;
    const child = spawn(command, args, { shell: true });

    child.stdout.on('data', (data) => {
      const decoded = data.toString();
      console.log('decoded: ', decoded);
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
