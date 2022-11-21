import { describe, it, expect, vi, afterEach } from 'vitest';
import tmp from 'tmp';
import path from 'path';
import fs from 'fs-extra';
import { build, BuildOptions } from 'esbuild';

const FixtureDir = path.resolve(__dirname, './fixtures');

const builder = async (
  out: string,
  esbuildOptions: BuildOptions = {}
  // pluginOptions?: Partial<Options>
): Promise<void> => {
  await build({
    entryPoints: [path.resolve(FixtureDir, 'index.ts')],
    absWorkingDir: FixtureDir,
    outfile: esbuildOptions?.outdir ? undefined : out,
    // plugins: [copy(pluginOptions)],
    ...(esbuildOptions ?? {}),
  });
};
