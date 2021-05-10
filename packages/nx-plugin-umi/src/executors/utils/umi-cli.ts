import execa from 'execa';
import { from } from 'rxjs';
import path from 'path';
import chalk from 'chalk';

export const umiPlugin = async (cwd: string) => {
  await execa.node(
    require.resolve('umi/lib/cli'),
    ['plugin', 'list', '--key'],
    {
      stdio: 'inherit',
      cwd,
      preferLocal: true,
    }
  );
};

export const umiVersion = async (cwd: string) => {
  await execa.node(require.resolve('umi/lib/cli'), ['version'], {
    stdio: 'inherit',
    cwd,
    preferLocal: true,
  });
};

export const umiWebpack = async (cwd: string, verbose: boolean) => {
  // TODO: get ruleSets/pluginSets by stdout
  const ruleSets = [
    'js',
    'js-for-umi-dist',
    'ts-in-node_modules',
    'js-in-node_modules',
    'images',
    'svg',
    'fonts',
    'plaintext',
    'css',
    'less',
  ];

  if (verbose) {
    for (const rule of ruleSets) {
      await execa.node(
        require.resolve('umi/lib/cli'),
        ['webpack', `--rule=${rule}`],
        {
          stdio: 'inherit',
          cwd,
          preferLocal: true,
        }
      );
    }
  }

  const pluginSets = [
    'extract-css',
    'define',
    'progress',
    'friendly-error',
    'hmr',
    'fork-ts-checker',
  ];

  if (verbose) {
    for (const plugin of pluginSets) {
      await execa.node(
        require.resolve('umi/lib/cli'),
        ['webpack', `--plugin=${plugin}`],
        {
          stdio: 'inherit',
          cwd,
          preferLocal: true,
        }
      );
    }
  }
};
