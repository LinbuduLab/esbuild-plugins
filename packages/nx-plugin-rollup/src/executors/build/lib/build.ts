import { RollupBuildSchema } from '../schema';
import { eachValueFrom } from 'rxjs-for-await';
import { from, Observable } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';

import { rollup, watch } from 'rollup';

import typescriptPlugin from 'rollup-plugin-typescript2';
import jsonPlugin from '@rollup/plugin-json';
import nodeResolvePlugin from '@rollup/plugin-node-resolve';

export const builder = async (options: RollupBuildSchema) => {
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
};
