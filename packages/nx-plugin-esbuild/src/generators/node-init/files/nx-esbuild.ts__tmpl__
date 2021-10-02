import { NXESBuildConfigExport } from 'nx-plugin-esbuild';
import { esbuildPluginAliasPath } from 'esbuild-plugin-alias-path';
import path from 'path';

export default {
  esbuildOptions: {
    plugins: [
      esbuildPluginAliasPath({
        alias:
          process.env.NODE_ENV === 'production'
            ? {
                './environments/environment': path.resolve(
                  __dirname,
                  './src/environments/environment.prod.ts'
                ),
              }
            : {},
        skip: process.env.NODE_ENV !== 'production',
        cwd: __dirname,
      }),
    ],
  },
  watchOptions: {},
} as NXESBuildConfigExport;
