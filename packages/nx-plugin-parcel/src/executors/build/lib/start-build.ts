import execa from 'execa';
import { from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';
import { ParcelBuildSchema } from '../schema';

// parcel build <entries>
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
// --host
// --no-autoinstall
// --no-optimize
// --no-scope-hoist
// --detailed-report
// --no-content-hash

export const startBuild = (options: ParcelBuildSchema) => {
  return from(
    execa(
      'parcel',
      [
        'build',
        // '--cache-dir=parcel/cache',
        // '--dist-dir=parcel/dist',
        '--log-level=verbose',
        // 'index.html',
        `${options.entryFiles}`,
      ],
      {
        stdio: 'inherit',
        preferLocal: true,
        cwd: options.cwd,
      }
    )
  );
};
