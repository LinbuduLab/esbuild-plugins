import { Observable } from 'rxjs';
import { spawn } from 'child_process';
import path from 'path';

interface RunTscOptions {
  tsconfigPath: string;
  watch: boolean;
  root: string;
  useGlobal?: boolean;
}

interface TSCEmit {
  info?: string;
  error?: string;
  tscError?: Error;
  end?: string;
}

export function runTSC({ tsconfigPath, watch, root }: RunTscOptions) {
  return new Observable<TSCEmit>((subscriber) => {
    const command = path.join(root, 'node_modules', '.bin', 'tsc');

    const args: string[] = ['--noEmit'];

    if (watch) {
      args.push('-w');
    }
    args.push(`-p ${tsconfigPath}`);

    let errorCount = 0;
    const child = spawn(command, args, { shell: true });

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
