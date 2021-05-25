import execa from 'execa';
import { from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';

import { startServe } from './lib/start-serve';
import { startProgrammaticServe } from './lib/start-programmatic-server';
import { ParcelServeSchema } from './schema';

import path from 'path';
// import Parcel from '@parcel/core';
// import ParcelFS from '@parcel/fs';

// Parcel2 目前的programmatic API不太好用
// 所以就先使用命令行的方式吧
// 和Vite插件一样 需要重点处理的是publicURL

export default function runExecutor(options: ParcelServeSchema) {
  return eachValueFrom(
    startProgrammaticServe(options.entries, options.cwd).pipe(
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

  // return startProgrammaticServe(options.entries, options.cwd);
}
