import execa, { Options } from 'execa';
import path from 'path';
import { Plugin } from 'esbuild';
import chokidar from 'chokidar';

const debug = require('debug')('plugin:run');

export interface RunOptions {
  execaOptions?: Options;
}

export default (options: RunOptions = {}): Plugin => {
  return {
    name: 'esbuild:run',
    async setup({ initialOptions }) {
      // if (!initialOptions.write) {
      //   throw new Error('should write!');
      // }
      debug('start');

      // support single entry only for now
      if (!initialOptions.outfile) {
        throw new Error('only single entry is supported!');
      }

      const filePath = path.join(process.cwd(), initialOptions.outfile);

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          debug('resolved');
          execa
            .node(filePath, {
              stdio: 'inherit',
              ...(options?.execaOptions ?? {}),
            })
            .then((cp) => {
              resolve();
            });
        }, 1000);
      });
    },
  };
};
