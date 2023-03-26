import { describe, it, expect, vi, afterEach } from 'vitest';
import tmp from 'tmp';
import path from 'path';
import fs from 'fs-extra';
import { build, BuildOptions } from 'esbuild';
import { copy } from '../src/lib/esbuild-plugin-copy';
import {
  ensureArray,
  verboseLog,
  formatAssets,
  PLUGIN_EXECUTED_FLAG,
} from '../src/lib/utils';

import type { Options } from '../src/lib/typings';

const FixtureDir = path.resolve(__dirname, './fixtures');

const builder = async (
  out: string,
  esbuildOptions: BuildOptions = {},
  pluginOptions?: Partial<Options>
): Promise<void> => {
  await build({
    entryPoints: [path.resolve(FixtureDir, 'index.ts')],
    absWorkingDir: FixtureDir,
    outfile: esbuildOptions?.outdir ? undefined : out,
    plugins: [copy(pluginOptions)],
    ...(esbuildOptions ?? {}),
  });
};

/**
 * ├── assets
│   ├── nest
│   │   ├── content.js
│   │   ├── deep
│   │   │   ├── deep.gql
│   │   │   └── deep.txt
│   │   ├── nest.txt
│   │   └── schema.prisma
│   ├── node.js
│   └── note.txt
 */

describe('CopyPlugin:Core', async () => {
  afterEach(() => {
    delete process.env[PLUGIN_EXECUTED_FLAG];
  });
  it('should works for from path: /**<1>', async () => {
    const outDir = tmp.dirSync().name;
    const outAssetsDir = tmp.dirSync().name;

    const out = path.join(outDir, 'index.js');
    const assetsDir = path.join(FixtureDir, 'assets');

    await builder(
      out,
      { outdir: outDir },
      {
        assets: {
          from: `${assetsDir}/**/*.txt`,
          to: `${outAssetsDir}/assets`,
        },
        resolveFrom: outDir,
        verbose: false,
      }
    );

    const d1 = fs.readdirSync(path.join(outAssetsDir, 'assets'));
    expect(d1).toEqual(['nest', 'note.txt']);

    const d2 = fs.readdirSync(path.join(outAssetsDir, 'assets', 'nest'), {});
    expect(d2).toEqual(['deep', 'nest.txt']);

    const d3 = fs.readdirSync(
      path.join(outAssetsDir, 'assets', 'nest', 'deep')
    );
    expect(d3).toEqual(['deep.txt']);
  });

  it('should works for from path: /**<2>', async () => {
    const outDir = tmp.dirSync().name;
    const outAssetsDir = tmp.dirSync().name;

    const out = path.join(outDir, 'index.js');
    const assetsDir = path.join(FixtureDir, 'assets');

    await builder(
      out,
      { outdir: outDir },
      {
        assets: {
          from: `${assetsDir}/**/*.js`,
          to: `${outAssetsDir}/assets`,
        },
        resolveFrom: outDir,
        verbose: false,
      }
    );

    const d1 = fs.readdirSync(path.join(outAssetsDir, 'assets'));
    expect(d1).toEqual(['nest', 'node.js']);

    const d2 = fs.readdirSync(path.join(outAssetsDir, 'assets', 'nest'), {});
    expect(d2).toEqual(['content.js']);
  });

  it('should works for from path: /**<3>', async () => {
    const outDir = tmp.dirSync().name;
    const outAssetsDir = tmp.dirSync().name;

    const out = path.join(outDir, 'index.js');
    const assetsDir = path.join(FixtureDir, 'assets');

    await builder(
      out,
      { outdir: outDir },
      {
        assets: {
          from: [`${assetsDir}/**/*.gql`, `${assetsDir}/**/*.prisma`],
          to: `${outAssetsDir}/assets`,
        },
        resolveFrom: outDir,
        verbose: false,
      }
    );

    const d1 = fs.readdirSync(path.join(outAssetsDir, 'assets'));
    expect(d1).toEqual(['nest']);

    const d2 = fs.readdirSync(path.join(outAssetsDir, 'assets', 'nest'), {});
    expect(d2).toEqual(['deep', 'schema.prisma']);

    const d3 = fs.readdirSync(
      path.join(outAssetsDir, 'assets', 'nest', 'deep')
    );
    expect(d3).toEqual(['deep.gql']);
  });

  it('should works for from path: /*<1>', async () => {
    const outDir = tmp.dirSync().name;
    const outAssetsDir = tmp.dirSync().name;

    const out = path.join(outDir, 'index.js');
    const assetsDir = path.join(FixtureDir, 'assets');

    await builder(
      out,
      { outdir: outDir },
      {
        assets: {
          from: `${assetsDir}/*.txt`,
          to: `${outAssetsDir}/assets`,
        },
        resolveFrom: outDir,
        verbose: false,
      }
    );

    const d1 = fs.readdirSync(path.join(outAssetsDir, 'assets'));
    expect(d1).toEqual(['note.txt']);
  });

  it('should works for from path: /*<2>', async () => {
    const outDir = tmp.dirSync().name;
    const outAssetsDir = tmp.dirSync().name;

    const out = path.join(outDir, 'index.js');
    const assetsDir = path.join(FixtureDir, 'assets');

    await builder(
      out,
      { outdir: outDir },
      {
        assets: {
          from: `${assetsDir}/*.js`,
          to: `${outAssetsDir}/assets`,
        },
        resolveFrom: outDir,
        verbose: false,
      }
    );

    const d1 = fs.readdirSync(path.join(outAssetsDir, 'assets'));
    expect(d1).toEqual(['node.js']);
  });

  it('should works for from path: /*<3>', async () => {
    const outDir = tmp.dirSync().name;
    const outAssetsDir = tmp.dirSync().name;

    const out = path.join(outDir, 'index.js');
    const assetsDir = path.join(FixtureDir, 'assets');

    await builder(
      out,
      { outdir: outDir },
      {
        assets: {
          from: `${assetsDir}/*`,
          to: `${outAssetsDir}/assets`,
        },
        resolveFrom: outDir,
        verbose: false,
      }
    );

    const d1 = fs.readdirSync(path.join(outAssetsDir, 'assets'));
    expect(d1).toEqual(['node.js', 'note.txt']);
  });

  it('should support once', async () => {
    const utils = await import('../src/lib/utils');

    vi.spyOn(utils, 'verboseLog');

    const outDir = tmp.dirSync().name;
    const outAssetsDir = tmp.dirSync().name;

    const out = path.join(outDir, 'index.js');
    const assetsDir = path.join(FixtureDir, 'assets');

    expect(process.env[PLUGIN_EXECUTED_FLAG]).toBeUndefined();

    await builder(
      out,
      { outdir: outDir },
      {
        assets: {
          from: `${assetsDir}/**/*.txt`,
          to: `${outAssetsDir}/assets`,
        },
        resolveFrom: outDir,
        verbose: false,
        once: true,
      }
    );

    expect(process.env[PLUGIN_EXECUTED_FLAG]).toBe('true');

    vi.mocked(verboseLog).mockClear();

    await builder(
      out,
      { outdir: outDir },
      {
        assets: {
          from: `${assetsDir}/**/*.txt`,
          to: `${outAssetsDir}/assets`,
        },
        resolveFrom: outDir,
        verbose: false,
        once: true,
      }
    );

    expect(verboseLog).toBeCalledTimes(1);
  });

  it('should return for empty assets', async () => {
    const utils = await import('../src/lib/utils');

    vi.spyOn(utils, 'verboseLog');

    const outDir = tmp.dirSync().name;
    const outAssetsDir = tmp.dirSync().name;

    const out = path.join(outDir, 'index.js');
    const assetsDir = path.join(FixtureDir, 'assets');

    expect(process.env[PLUGIN_EXECUTED_FLAG]).toBeUndefined();

    await builder(
      out,
      { outdir: outDir },
      {
        assets: [],
        resolveFrom: outDir,
        verbose: false,
        once: true,
      }
    );

    expect(verboseLog).toBeCalledTimes(0);
  });

  it('should support custom resolveForm<1>', async () => {
    const outDir = tmp.dirSync().name;
    const outAssetsDir = tmp.dirSync().name;

    const out = path.join(outDir, 'index.js');
    const assetsDir = path.join(FixtureDir, 'assets');

    await builder(
      out,
      { outdir: outDir },
      {
        assets: {
          from: `${assetsDir}/**/*.txt`,
          to: `assets`,
        },
        resolveFrom: outAssetsDir,
        verbose: false,
      }
    );

    const d1 = fs.readdirSync(path.join(outAssetsDir, 'assets'));
    expect(d1).toEqual(['nest', 'note.txt']);

    const d2 = fs.readdirSync(path.join(outAssetsDir, 'assets', 'nest'), {});
    expect(d2).toEqual(['deep', 'nest.txt']);

    const d3 = fs.readdirSync(
      path.join(outAssetsDir, 'assets', 'nest', 'deep')
    );
    expect(d3).toEqual(['deep.txt']);
  });

  it('should support custom resolveForm<2>', async () => {
    const outDir = tmp.dirSync().name;
    const outAssetsDir = tmp.dirSync().name;

    const out = path.join(outDir, 'index.js');
    const assetsDir = path.join(FixtureDir, 'assets');

    await builder(
      out,
      { outdir: outDir },
      {
        assets: {
          from: `${assetsDir}/**/*.txt`,
          to: `spec/assets`,
        },
        resolveFrom: outAssetsDir,
        verbose: false,
      }
    );

    const d1 = fs.readdirSync(path.join(outAssetsDir, 'spec', 'assets'));
    expect(d1).toEqual(['nest', 'note.txt']);

    const d2 = fs.readdirSync(
      path.join(outAssetsDir, 'spec', 'assets', 'nest'),
      {}
    );
    expect(d2).toEqual(['deep', 'nest.txt']);

    const d3 = fs.readdirSync(
      path.join(outAssetsDir, 'spec', 'assets', 'nest', 'deep')
    );
    expect(d3).toEqual(['deep.txt']);
  });

  it('should copy from file to file', async () => {
    const outDir = tmp.dirSync().name;

    await builder(
      outDir,
      { outdir: outDir },
      {
        assets: {
          from: path.resolve(__dirname, './fixtures/assets/note.txt'),
          to: 'hello.txt',
        },
        resolveFrom: outDir,
        verbose: false,
        dryRun: false,
      }
    );

    const d1 = fs.readdirSync(path.join(outDir), {});

    expect(d1).toEqual(['hello.txt', 'index.js']);
  });
  it.only('should copy from file to file with nested dest dir', async () => {
    const outDir = tmp.dirSync().name;

    await builder(
      outDir,
      { outdir: outDir },
      {
        assets: {
          from: path.resolve(__dirname, './fixtures/assets/note.txt'),
          to: './unexist/nest/dir/hello.txt',
        },
        resolveFrom: 'out',
        verbose: false,
        dryRun: false,
      }
    );

    const d1 = fs.readdirSync(path.join(outDir, 'unexist/nest/dir'), {});

    expect(d1).toEqual(['hello.txt']);
  });
});

describe('CopyPlugin:Utils', async () => {
  it('should format assets', async () => {
    expect(
      formatAssets([
        {
          from: 'a',
          to: 'b',
        },
      ])
    ).toEqual([
      {
        from: ['a'],
        to: ['b'],
        watch: false,
      },
    ]);

    expect(
      formatAssets({
        from: 'a',
        to: 'b',
      })
    ).toEqual([
      {
        from: ['a'],
        to: ['b'],
        watch: false,
      },
    ]);

    expect(
      formatAssets([
        {
          from: ['a'],
          to: ['b'],
          watch: true,
        },
      ])
    ).toEqual([
      {
        from: ['a'],
        to: ['b'],
        watch: true,
      },
    ]);
  });

  it('should ensure array', async () => {
    expect(ensureArray('a')).toEqual(['a']);
    expect(ensureArray(['a'])).toEqual(['a']);
  });

  it('should log for verbose only', async () => {
    vi.stubGlobal('console', {
      log: vi.fn(),
    });

    verboseLog('test', false);
    expect(console.log).not.toHaveBeenCalled();

    verboseLog('test', true);
    expect(console.log).toHaveBeenCalled();
  });
});
