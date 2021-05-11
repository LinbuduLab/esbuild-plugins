import { Plugin } from 'rollup';
import chalk from 'chalk';
import { normalizePath } from '@rollup/pluginutils';

interface Progress {
  total: number;
  loaded: number;
}

// TODO: enhancement

export default function progress(): Plugin {
  const progress: Progress = {
    total: 0,
    loaded: 0,
  };

  return {
    name: 'rollup:progress',

    load(id) {
      progress.loaded += 1;
      return null;
    },

    transform(code, id) {
      const filePath = normalizePath(id);

      if (process.stdout.isTTY) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        let output = '';
        if (progress.total > 0) {
          let percent = Math.round((100 * progress.loaded) / progress.total);
          output += Math.min(100, percent) + '% ';
        }
        output += `(${chalk.cyan(progress.loaded)}): ${filePath}`;

        if (output.length < process.stdout.columns) {
          process.stdout.write(output);
        } else {
          process.stdout.write(output.substring(0, process.stdout.columns - 1));
        }
      }

      return null;
    },

    generateBundle() {
      if (process.stdout.isTTY) {
        // process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
      }
    },
  };
}
