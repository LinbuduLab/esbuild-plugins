import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';
import tmp from 'tmp';
import fs from 'fs-extra';
import { build, BuildOptions, Plugin } from 'esbuild';
import { clean, CleanOptions } from '../src';
import del from 'del';

const builder = async (
  out: string,
  esbuildOptions: BuildOptions = {},
  pluginOptions?: CleanOptions
): Promise<void> => {
  await build({
    entryPoints: [path.resolve(__dirname, './fixtures/input.js')],
    absWorkingDir: path.resolve(__dirname, './fixtures'),
    outfile: esbuildOptions?.outdir ? undefined : out,
    bundle: true,
    plugins: [pluginOptions && clean(pluginOptions)].filter(
      Boolean
    ) as Plugin[],
    ...(esbuildOptions ?? {}),
  });
};

vi.mock('del', () => {
  return {
    default: vi.fn().mockResolvedValue(''),
  };
});

describe('clean', () => {
  beforeEach(() => {
    vi.mocked(del).mockClear();
  });

  it('should invoke del package<1>', async () => {
    const buildFile = tmp.fileSync();

    await builder(
      buildFile.name,
      {},
      {
        patterns: ['./foo/*'],
        cleanOnStartPatterns: ['./foo-start/*'],
        cleanOnEndPatterns: ['./foo-end/*'],
        sync: false,
      }
    );

    expect(del).toHaveBeenCalledWith(['./foo/*'], {
      dryRun: false,
    });

    expect(del).toHaveBeenCalledWith(['./foo-start/*'], {
      dryRun: false,
    });

    expect(del).toHaveBeenCalledWith(['./foo-end/*'], {
      dryRun: false,
    });
  });

  it('should invoke del package<2>', async () => {
    const buildFile = tmp.fileSync();

    await builder(
      buildFile.name,
      {},
      {
        patterns: ['./foo/*'],
        cleanOnStartPatterns: ['./foo-start/*'],
        cleanOnEndPatterns: ['./foo-end/*'],
        sync: false,
        cleanOn: 'both',
      }
    );

    expect(del).toBeCalledTimes(4);
  });

  it('should invoke del package<3>', async () => {
    const buildFile = tmp.fileSync();

    await builder(
      buildFile.name,
      {},
      {
        cleanOnStartPatterns: ['./foo/*'],
        sync: false,
        cleanOn: 'both',
        verbose: true,
      }
    );

    expect(del).toBeCalledTimes(1);
  });

  it('should invoke del package<4>', async () => {
    const buildFile = tmp.fileSync();

    await builder(
      buildFile.name,
      {},
      {
        patterns: [],
        cleanOnEndPatterns: [],
        cleanOnStartPatterns: [],
        sync: false,
        cleanOn: 'both',
        verbose: true,
      }
    );

    expect(del).toBeCalledTimes(0);
  });
});
