import { RollupBuildSchema } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { from, Observable } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';

import { rollup, watch } from 'rollup';

import typescriptPlugin from 'rollup-plugin-typescript2';
import jsonPlugin from '@rollup/plugin-json';
import nodeResolvePlugin from '@rollup/plugin-node-resolve';

import { watchBuilder } from './lib/watch';

// TODO: enable watch
export default function runExecutor(options: RollupBuildSchema) {
  return eachValueFrom(
    watchBuilder(options).pipe(
      map((x) => {
        return x;
      })
    )
  );

  // return eachValueFrom(
  //   from(bundler.write({ dir: options.outputPath, format: 'cjs' })).pipe(
  //     // map((bundler) =>
  //     //   bundler.write({ dir: options.outputPath, format: 'cjs' })
  //     // ),

  //     // map((writer) =>
  //     //   from(writer).pipe(
  //     //     tap((writer) => {
  //     //       console.log('writer: ', writer);
  //     //     })
  //     //   )
  //     // ),

  //     tap((x) => {
  //       console.log('x: ', x);
  //     }),

  //     map((x) => {
  //       return { success: true };
  //     })
  //   )
  // );
}
