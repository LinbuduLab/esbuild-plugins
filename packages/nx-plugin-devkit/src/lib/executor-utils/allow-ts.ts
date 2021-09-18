import { build, buildSync } from 'esbuild';
import type { BuildOptions } from 'esbuild';

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
  external: extraExternals,
});

/**
 * Use ESBuild to compile TypeScript files to plain JavaScript files with CommonJS
 * @param filePath
 * @returns
 */
export const buildToCode = async (
  filePath: string,
  extraExternals: string[] = []
): Promise<string> => {
  const buildResult = await build(
    createBuildToCodeOptions(filePath, extraExternals)
  );
  return buildResult.outputFiles[0].text;
};

/**
 * Sync version of `buildToCode`
 * @param filePath
 * @param extraExternals
 * @returns
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

/**
 * Allow require .ts file like `require("foo.ts")`
 * @param extraExternals
 */
export const allowTs = (extraExternals: string[] = []): void => {
  require.extensions['.ts'] = (m: any, filename) => {
    const code = buildToCodeSync(filename, extraExternals);
    m._compile(code, filename);
  };
};
