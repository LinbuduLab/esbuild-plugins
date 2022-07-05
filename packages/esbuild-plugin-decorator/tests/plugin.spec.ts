import { BuildOptions, Plugin, build } from 'esbuild';

import { ESBuildPluginDecoratorOptions } from '../src/lib/normalize-option';
import { esbuildPluginDecorator } from '../src/lib/esbuild-plugin-decorator';
import fs from 'fs-extra';
import path from 'path';
import tmp from 'tmp';

const builder = async (
  out: string,
  esbuildOptions: BuildOptions = {},
  pluginOptions?: ESBuildPluginDecoratorOptions
): Promise<void> => {
  await build({
    entryPoints: [path.resolve(__dirname, './fixtures/input.ts')],
    absWorkingDir: path.resolve(__dirname, './fixtures'),
    outfile: esbuildOptions?.outdir ? undefined : out,
    bundle: true,
    plugins: [pluginOptions && esbuildPluginDecorator(pluginOptions)].filter(
      Boolean
    ) as Plugin[],
    ...(esbuildOptions ?? {}),
  });
};

describe('should compile decorator', () => {
  it('should not compile decorator when not using plugin', async () => {
    const buildFile = tmp.fileSync();
    await builder(buildFile.name);

    expect(fs.readFileSync(buildFile.name, 'utf-8')).not.toContain('Reflect');
  });

  it('should compile decorator when using plugin & tsc', async () => {
    const buildFile = tmp.fileSync();
    await builder(
      buildFile.name,
      {},
      {
        tsconfigPath: path.resolve(__dirname, './fixtures/tsconfig.json'),
      }
    );

    expect(fs.readFileSync(buildFile.name, 'utf-8')).toContain('Reflect');
  });

  it('should compile decorator when using plugin & swc', async () => {
    const buildFile = tmp.fileSync();
    await builder(
      buildFile.name,
      {},
      {
        compiler: 'swc',
        swcCompilerOptions: {
          swcrcRoots: path.resolve(__dirname, './fixtures'),
          jsc: {
            target: 'es2015',
            parser: {
              syntax: 'typescript',
              tsx: false,
              decorators: true,
            },
            transform: {
              decoratorMetadata: true,
            },
          },
        },
        verbose: true,
        swcrcPath: path.resolve(__dirname, './fixtures/.swcrc'),
        tsconfigPath: path.resolve(__dirname, './fixtures/tsconfig.json'),
      }
    );
  });
});
