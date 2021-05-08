import execa from 'execa';
import { from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';

// parcel serve <entries>
// 如果
// --cache-dir
// --dist-dir
// --log-level
// --no-cache
// --no-source-maps
// --profile
// --public-url
// --target
// --no-hmr
// --port
// host
// --open

export const startServe = (cwd: string) => {
  return from(
    execa(
      'parcel',
      [
        'serve',
        // cache目录这个选项，最好放在工作区根目录
        // 最好区分下 /.parcel-cache/app这样
        // 不配置的话默认就是工作区/.parcel-cache
        // '--cache-dir=parcel/cache',
        // '--dist-dir=parcel/dist',
        '--log-level=verbose',
        'index.html',
      ],
      {
        stdio: 'inherit',
        preferLocal: true,
        cwd,
      }
    )
  );
};
