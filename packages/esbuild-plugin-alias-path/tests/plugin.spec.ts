import tmp from 'tmp';
import path from 'path';
import fs from 'fs-extra';
import { build, BuildOptions } from 'esbuild';
import { esbuildPluginAliasPath } from '../src/lib/esbuild-plugin-alias-path';
import { Options } from '../src/lib/normalize-options';

let originOutputFile: string;
let originOutput: string;

const builder = async (
  out: string,
  esbuildOptions: BuildOptions = {},
  pluginOptions?: Options
): Promise<void> => {
  await build({
    entryPoints: [path.resolve(__dirname, './fixtures/input.js')],
    absWorkingDir: path.resolve(__dirname, './fixtures'),
    outfile: esbuildOptions?.outdir ? undefined : out,
    bundle: true,
    plugins: [pluginOptions && esbuildPluginAliasPath(pluginOptions)].filter(
      Boolean
    ),
    ...(esbuildOptions ?? {}),
  });
};

describe('esbuildPluginAliasPath', () => {
  it('should throw when no alias path is provided', async () => {
    const buildFile = tmp.fileSync();

    await expect(builder(buildFile.name, {})).rejects.toThrow();
  });

  it('should apply alias transform', async () => {
    const buildFile = tmp.fileSync();

    await builder(
      buildFile.name,
      {},
      {
        alias: {
          '@alias/*': path.resolve(__dirname, './fixtures/alias'),
        },
      }
    );

    const buildResult = fs.readFileSync(buildFile.name, 'utf-8');

    expect(buildResult).toContain('alias:foo');
    expect(buildResult).toContain('alias:bar');
  });
});
