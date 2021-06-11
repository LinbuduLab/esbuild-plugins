import {
  SnowpackConfig,
  SnowpackPlugin,
  SnowpackPluginFactory,
  logger,
} from 'snowpack';
import chalk from 'chalk';
import execa, { Options, SyncOptions, NodeOptions } from 'execa';

export interface ExecaPluginOptions {
  // sync?: boolean;
  // node?: boolean;
  commands?: CommandItem[];
  sharedOptions?: Options;
  throwOnCommandFailed?: boolean;
}

export interface CommandItem {
  command?: string;
  args?: string[];
  options?: Options;
}

export type ExecaPlugin = SnowpackPluginFactory<ExecaPluginOptions>;

export const snowpackPluginExeca: ExecaPlugin = (
  snowpackConfig: SnowpackConfig,
  pluginOptions: ExecaPluginOptions
): SnowpackPlugin => {
  const {
    commands = [],
    sharedOptions = {},
    throwOnCommandFailed = true,
  } = pluginOptions;

  return {
    name: 'plugin:execa',
    async run(options) {
      if (!commands.length) {
        return;
      }

      for (const { command, args, options } of commands) {
        const commandInfo = chalk.cyan(`${command} ${args.join(' ')}`);

        console.log(`${commandInfo} execution starting`);

        const cp = execa(command, args, {
          stdio: 'pipe',
          ...sharedOptions,
          ...options,
        });

        cp.stdout.on('data', (msg) => {
          console.log(`${commandInfo} execution result:`);
          console.log(msg.toString());
        });

        cp.stderr.on('data', (err) => {
          console.log(`${commandInfo} execution failed`);
          if (throwOnCommandFailed) {
            // utf-8 ... ?
            throw new Error(err.toString());
          } else {
            console.error(err.toString());
          }
        });

        cp.stdout.on('end', () => {
          console.log(`${commandInfo} execution finished`);
        });
      }

      // execa.sync
      // .command
      // .commandSync
      // node
    },
  };
};

export default snowpackPluginExeca;
