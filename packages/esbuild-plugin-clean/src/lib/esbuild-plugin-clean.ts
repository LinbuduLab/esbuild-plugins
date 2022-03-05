import { Plugin } from 'esbuild';
import chalk from 'chalk';
import del, { Options as DelOptions } from 'del';

// const debug = require('debug')('plugin:clean');

export interface CleanOptions {
  patterns?: string | string[];
  dryRun?: boolean;
  options?: DelOptions;
  sync?: boolean;
  cleanOn?: 'start' | 'end' | 'both';
}

export default (options: CleanOptions = {}): Plugin => {
  const patterns = options.patterns ?? [];
  const dryRun = options.dryRun ?? false;
  const delOptions = options.options ?? {};
  const sync = options.sync ?? true;
  const cleanOn = options.cleanOn ?? 'start';

  const logCleanFiles = (cleanFiles: string[]) => {
    if (dryRun) {
      console.log(chalk.blue('i'), `Clean plugin invoked in dryRun mode`);
    }
    if (cleanFiles.length) {
      console.log(chalk.blue('i'), `File Cleaned:\n${cleanFiles.join('\n')}`);
    }
  };

  const handler = sync
    ? () => {
        const cleanFiles = del.sync(patterns, {
          dryRun,
          ...delOptions,
        });
        logCleanFiles(cleanFiles);
      }
    : () => {
        del(patterns, {
          dryRun,
          ...delOptions,
        }).then((cleanFiles) => {
          logCleanFiles(cleanFiles);
        });
      };

  return {
    name: 'esbuild:clean',
    setup({
      initialOptions,
      onStart: registerOnStartCallback,
      onEnd: registerOnEndCallback,
    }) {
      if (!patterns.length) {
        return;
      }

      if (cleanOn === 'start' || cleanOn === 'both') {
        registerOnStartCallback(() => {
          handler();
        });
      }

      if (cleanOn === 'end' || cleanOn === 'both') {
        registerOnEndCallback(() => {
          handler();
        });
      }
    },
  };
};
