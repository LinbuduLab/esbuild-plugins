import { RollupBuildSchema } from '../schema';
import { eachValueFrom } from 'rxjs-for-await';
import { from, Observable } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';

import { rollup, watch } from 'rollup';

import typescriptPlugin from 'rollup-plugin-typescript2';
import jsonPlugin from '@rollup/plugin-json';
import nodeResolvePlugin from '@rollup/plugin-node-resolve';

export const watchBuilder = (
  options: RollupBuildSchema
): Observable<{ success: boolean }> => {
  return new Observable((subscriber) => {
    const bundler = watch({
      input: options.entryFile,
      output: {
        dir: options.outputPath,
      },
      plugins: [
        typescriptPlugin({ tsconfig: options.tsconfigPath }),
        // progressPlugin(),
        jsonPlugin(),
        nodeResolvePlugin(),
      ],
      watch: {
        buildDelay: 200,
      },
    });

    bundler.on('event', async (evt) => {
      if (evt.code === 'BUNDLE_START') {
        console.log('BUNDLE_START');
        subscriber.next({
          success: true,
        });
      }
    });

    bundler.on('event', async (evt) => {
      if (evt.code === 'BUNDLE_END') {
        console.log('BUNDLE_END');
        await evt.result.write({ dir: options.outputPath, format: 'cjs' });
        console.log(evt.duration);
        await evt.result.close();

        subscriber.next({
          success: true,
        });
      }
    });

    // return {
    //   success: true,
    // };
  });
};
