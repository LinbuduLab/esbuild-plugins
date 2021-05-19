import { build, buildSync } from 'esbuild';
import type { BuildOptions } from 'esbuild';
import { esbuildPluginNodeExternals } from 'esbuild-plugin-node-externals';

/**
 * Create esbuild `BuildOptions` for `buildToCode`
 */
export const createBuildToCodeOptions = (
  filePath: string,
  extraExternals: string[] = []
): BuildOptions & { write: false } => ({
  entryPoints: [filePath],
  format: 'cjs',
  platform: 'node',
  target: 'node12',
  bundle: true,
  write: false,
  external: [
    'fsevents',
    'vuepress',
    '@vuepress/*',
    'vite',
    'rollup',
    'react-refresh',
    'terser',
    ...extraExternals,
  ],
});

/**
 * Take a file as entry point, and build it to cjs code
 */
export const buildToCode = async (filePath: string): Promise<string> => {
  const buildResult = await build(createBuildToCodeOptions(filePath));
  return buildResult.outputFiles[0].text;
};

/**
 * Sync version fo `buildToCode`
 */
export const buildToCodeSync = (
  filePath: string,
  extraExternals: string[] = []
): string => {
  const buildResult = buildSync(
    createBuildToCodeOptions(filePath, extraExternals)
  );
  return buildResult.outputFiles[0].text;
};

export const allowTs = (extraExternals: string[] = []): void => {
  // eslint-disable-next-line node/no-deprecated-api
  require.extensions['.ts'] = (m: any, filename) => {
    const code = buildToCodeSync(filename, extraExternals);
    m._compile(code, filename);
  };
};
