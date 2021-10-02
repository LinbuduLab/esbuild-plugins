import { NXESBuildConfigExport } from 'nx-plugin-esbuild';
import { esbuildPluginAliasPath } from 'esbuild-plugin-alias-path';

export default {
  esbuildOptions: {
    plugins: [
      esbuildPluginAliasPath({
        alias:
          process.env.NODE_ENV === 'production'
            ? {
                './environments/environment':
                  './environments/environment.prod.ts',
              }
            : {},
        skip: process.env.NODE_ENV !== 'production',
        cwd: __dirname,
      }),
    ],
  },
  watchOptions: {},
} as NXESBuildConfigExport;
