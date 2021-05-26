import execa from 'execa';
import { from, Observable } from 'rxjs';
import { ParcelServeSchema } from '../schema';

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

// FIXME: use require.resolve('parcel/lib/cli')
export const startServe = (options: ParcelServeSchema) => {
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
        // 'index.html',
        // TODO: handle array
        `${options.entryFiles}`,
      ],
      {
        stdio: 'inherit',
        cwd: options.cwd,
        preferLocal: true,
      }
    )
  );
};
