import type { BuildOptions } from 'esbuild';
import uniqBy from 'lodash/uniqBy';
import type { NormalizedESBuildExecutorSchema } from '../schema';

// remove built-in plugins
export function resolveESBuildOption(
  options: NormalizedESBuildExecutorSchema
): BuildOptions {
  const external = Array.isArray(options.externalDependencies)
    ? options.externalDependencies
    : [];

  const userConfigPlugins = options?.extendBuildOptions?.plugins ?? [];

  const dedupedPluginList = uniqBy(userConfigPlugins, (plugin) => plugin.name);

  const esbuildRunnerOptions: BuildOptions = {
    tsconfig: options.tsconfigPath,
    entryPoints: [options.main],
    absWorkingDir: options.absoluteWorkspaceRoot,
    plugins: dedupedPluginList,
    external,
    outdir: options.outputPath,

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
