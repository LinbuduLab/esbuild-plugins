import { Plugin } from 'esbuild';
import chalk from 'chalk';
import del, { Options as DelOptions } from 'del';

export interface CleanOptions {
  /**
   * file clean patterns (passed to `del`)
   *
   * @default: []
   */
  patterns?: string | string[];
  /**
   * use dry-run mode to see what's going to happen
   *
   * remember to set `verbose: true`
   *
   * @default: false
   */
  dryRun?: boolean;
  /**
   * extra options passed to `del`
   *
   * @default {}
   */
  options?: DelOptions;
  /**
   * execute clean sync or async (use `del` or `del.sync` for cleaning up)
   *
   * @default: true
   */
  sync?: boolean;
  /**
   * do cleaning in start / end / both
   * maybe in some strange cases you will need it ? :P
   *
   * @default: "start"
   */
  cleanOn?: 'start' | 'end' | 'both';
  /**
   * enable verbose logging
   *
   * @default false
   */
  verbose?: boolean;
}

export const clean = (options: CleanOptions = {}): Plugin => {
  const patterns = options.patterns ?? [];
  const dryRun = options.dryRun ?? false;
  const delOptions = options.options ?? {};
  const sync = options.sync ?? true;
  const cleanOn = options.cleanOn ?? 'start';
  const verbose = options.verbose ?? false;

  const logCleanFiles = (cleanFiles: string[]) => {
    if (!verbose) {
      return;
    }
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
    setup({ onStart: registerOnStartCallback, onEnd: registerOnEndCallback }) {
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
