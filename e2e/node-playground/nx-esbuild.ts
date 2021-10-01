import { NXESBuildConfigExport } from 'nx-plugin-esbuild';
import { esbuildPluginDecorator } from 'esbuild-plugin-decorator';
import { esbuildPluginAliasPath } from 'esbuild-plugin-alias-path';
import path from 'path';

export default {
  esbuildOptions: {
    plugins: [
      esbuildPluginDecorator({
        tsconfigPath: path.resolve(__dirname, './tsconfig.json'),
        verbose: false,
      }),
      esbuildPluginAliasPath({
        tsconfigPath: path.resolve(__dirname, './tsconfig.json'),
      }),
    ],
  },
  watchOptions: {},
} as NXESBuildConfigExport;
