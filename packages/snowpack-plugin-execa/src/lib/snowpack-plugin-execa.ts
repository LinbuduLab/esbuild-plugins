import {
  SnowpackConfig,
  SnowpackPlugin,
  SnowpackPluginFactory,
} from 'snowpack';
import execa, { Options, SyncOptions, NodeOptions } from 'execa';

export interface ExecaPluginOptions {
  // sync?: boolean;
  node?: boolean;
  file?: string;
  args?: readonly string[];
  options?: Options | NodeOptions;
}

export type ExecaPlugin = SnowpackPluginFactory<ExecaPluginOptions>;

export const snowpackPluginExeca: ExecaPlugin = (
  snowpackConfig: SnowpackConfig,
  pluginOptions: ExecaPluginOptions
): SnowpackPlugin => {
  const { file, args, options } = pluginOptions;

  return {
    name: 'plugin:execa',
    async run(options) {
      execa(file, args, options as Options);
      // execa.sync
      // .command
      // .commandSync
      // node
    },
  };
};
