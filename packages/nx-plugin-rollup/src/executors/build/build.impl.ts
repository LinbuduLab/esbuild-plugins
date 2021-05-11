import { RollupBuildSchema } from './schema';
import { eachValueFrom } from 'rxjs-for-await';
import { from, Observable } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';

import { rollup, watch } from 'rollup';

import terserPlugin from 'rollup-plugin-terser';
import fileSizePlugin from 'rollup-plugin-filesize';
import dtsPlugin from 'rollup-plugin-dts';
import typescriptPlugin from 'rollup-plugin-typescript2';
import esbuildPlugin from 'rollup-plugin-esbuild';
import progressPlugin from 'rollup-plugin-progress';
import aliasPlugin from '@rollup/plugin-alias';
import babelPlugin from '@rollup/plugin-babel';
import commonjsPlugin from '@rollup/plugin-commonjs';
import htmlPlugin from '@rollup/plugin-html';
import imagePlugin from '@rollup/plugin-image';
import injectPlugin from '@rollup/plugin-inject';
import jsonPlugin from '@rollup/plugin-json';
import nodeResolvePlugin from '@rollup/plugin-node-resolve';
import replacePlugin from '@rollup/plugin-replace';
import runPlugin from '@rolluP/plugin-run';

// TODO: enable watch
export default async function runExecutor(options: RollupBuildSchema) {
  console.log('Executor ran for Build', options);

  const bundler = await rollup({
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

  await bundler.write({ dir: options.outputPath, format: 'cjs' });

  return {
    success: true,
  };

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
