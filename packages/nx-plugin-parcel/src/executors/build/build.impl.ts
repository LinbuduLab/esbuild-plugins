import execa from 'execa';
import { from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';
import { ParcelBuildSchema } from './schema';
import { startBuild } from './lib/start-build';

// import { startServe } from '../utils/start-serve';

import path from 'path';
import Parcel from '@parcel/core';
import ParcelFS from '@parcel/fs';

// Parcel2 目前的programmatic API不太好用
// 所以就先使用命令行的方式吧
// 和Vite插件一样 需要重点处理的是publicURL

export default function runExecutor(options: ParcelBuildSchema) {
  return eachValueFrom(
    startBuild(options).pipe(
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
