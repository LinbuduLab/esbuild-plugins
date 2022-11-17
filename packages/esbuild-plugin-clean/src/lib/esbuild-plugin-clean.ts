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
   * file clean patterns(in onStart only) (passed to `del`)
   *
   * @default: []
   */
  cleanOnStartPatterns?: string | string[];

  /**
   * file clean patterns(in onEnd only) (passed to `del`)
   *
   * @default: []
   */
  cleanOnEndPatterns?: string | string[];

  /**
   * use dry-run mode to see what's going to happen
   *
   * this option will enable verbose option automatically
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
   * enable verbose logging to see what's happening
   *
   * @default false
   */
  verbose?: boolean;
}

export const clean = (options: CleanOptions = {}): Plugin => {
  const {
    patterns = [],
    cleanOnStartPatterns = [],
    cleanOnEndPatterns = [],
    dryRun = false,
    options: delOptions = {},
    sync = true,
    cleanOn = 'start',
    verbose: _verbose = false,
  } = options;

  const verbose = dryRun || _verbose;

  const logCleanFiles = (type: string, cleanFiles: string[]) => {
    if (!verbose) {
      return;
    }
    if (dryRun) {
      console.log(chalk.blue('i'), `Clean plugin invoked in dryRun mode`);
    }
    if (cleanFiles.length) {
      console.log(
        chalk.blue('i'),
        `${type} File Cleaned:\n${cleanFiles.join('\n')}`
      );
    }
  };

  const handler = sync
    ? (type: string, patterns: CleanOptions['patterns']) => {
        const cleanFiles = del.sync(patterns, {
          dryRun,
          ...delOptions,
        });
        logCleanFiles(type, cleanFiles);
      }
    : (type: string, patterns: CleanOptions['patterns']) => {
        del(patterns, {
          dryRun,
          ...delOptions,
        }).then((cleanFiles) => {
          logCleanFiles(type, cleanFiles);
        });
      };

  return {
    name: 'plugin:clean',
    setup({ onStart: registerOnStartCallback, onEnd: registerOnEndCallback }) {
      if (
        !patterns.length &&
        !cleanOnStartPatterns.length &&
        !cleanOnEndPatterns.length
      ) {
        return;
      }

      if (cleanOn === 'start' || cleanOn === 'both') {
        registerOnStartCallback(() => {
          patterns.length && handler('NormalPatterns', patterns);
        });
      }

      if (cleanOn === 'end' || cleanOn === 'both') {
        registerOnEndCallback(() => {
          patterns.length && handler('NormalPatterns', patterns);
        });
      }

      registerOnStartCallback(() => {
        cleanOnStartPatterns.length &&
          handler('CleanOnStartPatterns', cleanOnStartPatterns);
      });

      registerOnEndCallback(() => {
        cleanOnEndPatterns.length &&
          handler('CleanOnEndPatterns', cleanOnEndPatterns);
      });
    },
  };
};
