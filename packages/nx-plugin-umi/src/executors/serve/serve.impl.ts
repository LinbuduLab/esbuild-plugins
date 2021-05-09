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
import { startUmiServe } from '../utils/start-umi-serve';

export default function runExecutor(options: any) {
  // 有无现成的ChildProcess转Promise？
  // 看起来不需要，只要模仿umi fork处理一下inspection相关即可

  return eachValueFrom(
    startUmiServe(options.cwd).pipe(
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
