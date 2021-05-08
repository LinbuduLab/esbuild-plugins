import { join } from 'path';
import { chalk, yParser } from '@umijs/utils';
import { existsSync } from 'fs';
import { Service } from 'umi/lib/ServiceWithBuiltIn';
import fork from 'umi/lib/utils/fork';
import getCwd from 'umi/lib/utils/getCwd';
import getPkg from 'umi/lib/utils/getPkg';
import initWebpack from 'umi/lib/initWebpack';
import execa from 'execa';
import { from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';

export default function runExecutor(options: any) {
  // 有无现成的ChildProcess转Promise？
  // const child = fork({
  //   scriptPath: require.resolve('umi/lib/forkedDev'),
  // });

  // const cp = execa.node(require.resolve('umi/lib/forkedDev'), {
  //   cwd: options.cwd,
  //   stdio: 'inherit',
  // });

  // process.on('SIGINT', () => {
  //   child.kill('SIGINT');
  //   process.exit(0);
  // });
  // process.on('SIGTERM', () => {
  //   child.kill('SIGTERM');
  //   process.exit(1);
  // });
  return eachValueFrom(
    from(
      execa.node(require.resolve('umi/lib/forkedDev'), {
        cwd: options.cwd,
        stdio: 'inherit',
      })
    ).pipe(
      tap((x) => {
        console.log(x);
      }),
      map(() => {
        return {
          success: true,
        };
      })
    )
  );
}
