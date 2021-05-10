// https://github.com/umijs/umi/blob/master/packages/umi/src/initWebpack.ts
import { init } from '@umijs/deps/compiled/webpack';
import { init as initRequreHook } from '@umijs/bundler-webpack/lib/requireHook';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

const DEFAULT_CONFIG_FILES = [
  '.umirc.ts',
  '.umirc.js',
  'config/config.ts',
  'config/config.js',
];

function getConfigFile(opts: { cwd: string }) {
  const configFile = DEFAULT_CONFIG_FILES.filter((file) => {
    return existsSync(join(opts.cwd, file));
  })[0];
  return configFile ? join(opts.cwd, configFile) : null;
}

export default (cwd?: string) => {
  // 1. read user config
  // 2. if have webpack5:
  // 3. init webpack with webpack5 flag

  const configFile = getConfigFile({ cwd: cwd ?? process.cwd() });
  console.log(
    chalk.green(`initWebpack is loading config file from ${configFile}`)
  );

  const configContent = configFile ? readFileSync(configFile, 'utf-8') : '';

  // TODO: detect with ast
  const haveWebpack5 =
    configContent.includes('webpack5:') &&
    !configContent.includes('// webpack5:') &&
    !configContent.includes('//webpack5:');

  if (haveWebpack5 || process.env.USE_WEBPACK_5) {
    process.env.USE_WEBPACK_5 = '1';
    console.log(chalk.green(`Using Webpack 5`));
    init(true);
  } else {
    init();
  }

  initRequreHook();
};
