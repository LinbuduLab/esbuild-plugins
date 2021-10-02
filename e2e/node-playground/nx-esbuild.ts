import { NXESBuildConfigExport } from 'nx-plugin-esbuild';
import { esbuildPluginDecorator } from 'esbuild-plugin-decorator';
import { esbuildPluginAliasPath } from 'esbuild-plugin-alias-path';
import path from 'path';

// bundle true 时，能自动找到
export default {
  esbuildOptions: {
    platform: 'node',
    bundle: true,
    entryPoints: [path.join(__dirname, './src/main.ts')],
    plugins: [
      esbuildPluginDecorator({
        tsconfigPath: path.resolve(__dirname, './tsconfig.json'),
        verbose: false,
        compiler: 'tsc',
      }),
      esbuildPluginAliasPath({
        alias: {
          '@alias/*': path.resolve(__dirname, './src/alias'),
        },
      }),
    ],
  },
  watchOptions: {},
} as NXESBuildConfigExport;
