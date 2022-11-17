import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';
import tmp from 'tmp';
import fs from 'fs-extra';
import { build, BuildOptions, Plugin } from 'esbuild';
import { compress, CompressOptions } from '../src';
import zlib from 'zlib';

const builder = async (
  out: string,
  esbuildOptions: BuildOptions = {},
  pluginOptions?: CompressOptions
): Promise<void> => {
  await build({
    entryPoints: [path.resolve(__dirname, './fixtures/input.js')],
    absWorkingDir: path.resolve(__dirname, './fixtures'),
    outfile: esbuildOptions?.outdir ? undefined : out,
    bundle: true,
    plugins: [pluginOptions && compress(pluginOptions)].filter(
      Boolean
    ) as Plugin[],
    ...(esbuildOptions ?? {}),
  });
};

vi.spyOn(zlib, 'gzipSync');
vi.spyOn(zlib, 'brotliCompressSync');

describe('compress', () => {
  beforeEach(() => {
    vi.spyOn(zlib, 'gzipSync').mockClear();
    vi.spyOn(zlib, 'brotliCompressSync').mockClear();
  });

  it('should not invoke when enable write option', async () => {
    const buildFile = tmp.fileSync().name;

    await builder(
      `${buildFile}.js`,
      {
        write: true,
      },
      {
        gzip: true,
        brotli: true,
      }
    );
  });

  it('should handle single file with outfile option', async () => {
    const buildFile = tmp.fileSync().name;

    await builder(
      `${buildFile}.js`,
      {
        write: false,
      },
      {
        gzip: true,
        brotli: true,
      }
    );

    expect(fs.existsSync(path.resolve(buildFile + '.js.gz'))).toBe(true);
    expect(fs.existsSync(path.resolve(buildFile + '.js.br'))).toBe(true);
  });

  it('should handle single file with outdir option with bundle option', async () => {
    const buildDir = tmp.dirSync().name;

    await builder(
      '',
      {
        outdir: buildDir,
        write: false,
      },
      {
        gzip: true,
        brotli: true,
      }
    );

    const dir = fs.readdirSync(buildDir);

    expect(dir).toContain('input.js.gz');
    expect(dir).toContain('input.js.br');
  });

  it('should support exclude patterns', async () => {
    const buildDir = tmp.dirSync().name;

    await builder(
      '',
      {
        entryPoints: [
          path.resolve(__dirname, './fixtures/input.js'),
          path.resolve(__dirname, './fixtures/input2.js'),
        ],
        outdir: buildDir,
        write: false,
        bundle: false,
      },
      {
        gzip: true,
        brotli: true,
        exclude: ['**/*2.js'],
      }
    );

    const dir = fs.readdirSync(buildDir);

    expect(dir).toContain('input.js.gz');
    expect(dir).toContain('input.js.br');
    expect(dir).toContain('input.js.br');

    expect(dir).toContain('input2.js');
    expect(dir).not.toContain('input2.js.gz');
    expect(dir).not.toContain('input2.js.br');
  });

  it('should control origin file', async () => {
    const buildDir = tmp.dirSync().name;

    await builder(
      '',
      {
        outdir: buildDir,
        write: false,
      },
      {
        gzip: true,
        brotli: true,
        emitOrigin: false,
      }
    );

    const dir = fs.readdirSync(buildDir);

    expect(dir).toContain('input.js.gz');
    expect(dir).toContain('input.js.br');
    expect(dir).not.toContain('input.js');
  });
});
