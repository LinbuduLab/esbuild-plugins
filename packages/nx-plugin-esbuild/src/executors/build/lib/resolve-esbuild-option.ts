import type { BuildOptions } from 'esbuild';
import uniqBy from 'lodash/uniqBy';
import type { NormalizedESBuildExecutorSchema } from '../schema';

import { esbuildPluginDecorator } from 'esbuild-plugin-decorator';
import { esbuildPluginNodeExternals } from 'esbuild-plugin-node-externals';
import { esbuildPluginAliasPath } from 'esbuild-plugin-alias-path';

export function resolveESBuildOption(
  options: NormalizedESBuildExecutorSchema
): BuildOptions {
  const presetPlugins = [
    esbuildPluginDecorator({
      tsconfigPath: options.tsconfigPath,
      compiler: 'tsc',
      isNxProject: true,
      verbose: false,
    }),
    options.externalDependencies === 'all' && esbuildPluginNodeExternals(),
    esbuildPluginAliasPath({
      alias: options.alias,
      tsconfigPath: options.tsconfigPath,
    }),
  ].filter(Boolean);

  const external = Array.isArray(options.externalDependencies)
    ? options.externalDependencies
    : [];

  const userConfigPlugins = options?.extendBuildOptions?.plugins ?? [];

  const decupedPlugins = uniqBy(
    [...presetPlugins, ...userConfigPlugins],
    (plugin) => plugin.name
  );

  delete options.extendBuildOptions?.plugins;

  const esbuildRunnerOptions: BuildOptions = {
    logLevel: options.logLevel,
    logLimit: options.logLimit,
    platform: options.platform,
    format: options.format,
    bundle: options.bundle,
    sourcemap: options.sourceMap,
    charset: 'utf8',
    color: true,
    conditions: options.watch ? ['development'] : ['production'],
    watch: options.watch,
    absWorkingDir: options.workspaceRoot,
    plugins: decupedPlugins,
    tsconfig: options.tsconfigPath,
    entryPoints: [options.main],
    outdir: options.outputPath,
    external,
    incremental: options.watch,
    banner: options.inserts.banner,
    footer: options.inserts.footer,
    metafile: options.metaFile,
    minify: options.minify,
    loader: options.loader,
    target: options.target,
    splitting: options.splitting,
    outExtension: options.outExtension,
    minifyIdentifiers: options.minify,
    minifyWhitespace: options.minify,
    minifySyntax: options.minify,
    inject: options.inject,
    define: options.define,
    write: options.write,
    ...options.extendBuildOptions,
  };

  return esbuildRunnerOptions;
}
