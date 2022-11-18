import type { Plugin } from 'esbuild';

export const ___plugin = (options = {}): Plugin => {
  return {
    name: 'plugin:___plugin',
    setup(build) {},
  };
};
