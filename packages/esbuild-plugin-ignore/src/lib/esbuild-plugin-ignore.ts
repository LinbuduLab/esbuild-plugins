import type { Plugin } from 'esbuild';
import chalk from 'chalk';

export interface IgnorePattern {
  // internal require/import
  // /^\.\/locale$/
  resourceRegExp?: RegExp;
  // directories
  // /moment$/
  contextRegExp?: RegExp;
  // TODO:
  // checkResource?: (resourceRegExp: RegExp, contextRegExp: RegExp) => boolean;
}

export interface ESBuildPluginIgnoreOption {
  ignore?: IgnorePattern | IgnorePattern[];
  verbose?: boolean;
}

export default (options: ESBuildPluginIgnoreOption = {}): Plugin => {
  const ignorePatterns = (options.ignore
    ? Array.isArray(options.ignore)
      ? options.ignore
      : [options.ignore]
    : []
  ).filter((pattern) => pattern.resourceRegExp);

  const verbose = options.verbose ?? true;

  return {
    name: 'plugin:ignore',
    setup(build) {
      // 如果存在多个相同resourceRegExp的pair，则只会移除最先被解析的那个

      ignorePatterns.forEach((pattern) => {
        build.onResolve(
          { filter: pattern.resourceRegExp },
          ({ path, importer }) => {
            if (
              pattern.contextRegExp &&
              importer.match(pattern.contextRegExp)
            ) {
              verbose &&
                console.log(
                  chalk.blue('i'),
                  `module ${chalk.cyan(path)} from ${chalk.cyan(
                    importer
                  )} was ignored. \n`
                );

              return {
                path,
                namespace: 'ignore',
              };
            } else if (!pattern.contextRegExp) {
              verbose &&
                console.log(
                  chalk.blue('i'),
                  `module ${chalk.cyan(path)} from ${chalk.bold.cyan(
                    'all import/require'
                  )} was ignored. \n`
                );

              return {
                path,
                namespace: 'ignore',
              };
            } else {
              return { path: require.resolve(path) };
            }
          }
        );
      });

      build.onLoad({ filter: /.*/, namespace: 'ignore' }, (args) => {
        return {
          contents: '',
        };
      });
    },
  };
};
