import { describe, it, expect } from 'vitest';
import tmp from 'tmp';
import path from 'path';
import fs from 'fs-extra';
import { build, BuildOptions, Plugin } from 'esbuild';
import { aliasPath } from '../src/lib/esbuild-plugin-alias-path';
import { AliasPathOptions } from '../src/lib/normalize-options';
import { normalizeOption } from '../src/lib/normalize-options';
import { escapeNamespace } from '../src/lib/esbuild-plugin-alias-path';

const builder = async (
  out: string,
  esbuildOptions: BuildOptions = {},
  pluginOptions?: AliasPathOptions
): Promise<void> => {
  await build({
    entryPoints: [path.resolve(__dirname, './fixtures/input.js')],
    absWorkingDir: path.resolve(__dirname, './fixtures'),
    outfile: esbuildOptions?.outdir ? undefined : out,
    bundle: true,
    plugins: [pluginOptions && aliasPath(pluginOptions)].filter(
      Boolean
    ) as Plugin[],
    ...(esbuildOptions ?? {}),
  });
};

/**
 * tests/fixtures
├── alias
│   ├── bar.js
│   ├── deep
│   │   └── baz.js
│   └── foo.js
├── fixed_alias
│   └── foo.js
└── input.js
 */

describe('should normalize options', () => {
  it('should skip only when no alias / patn configurated or set option.skip', () => {
    expect(
      normalizeOption({
        alias: {
          '@alias/foo': path.join(__dirname, './fixtures/fixed_alias/foo.js'),
        },
      }).skip
    ).toBeFalsy();

    expect(
      normalizeOption({
        alias: {},
      }).skip
    ).toBeTruthy();

    expect(
      normalizeOption({
        skip: true,
      }).skip
    ).toBeTruthy();
  });

  it('should support dir alias', () => {
    expect(
      normalizeOption({
        alias: {
          '@alias/*': path.join(__dirname, './fixtures/simple-alias'),
        },
      }).alias
    ).toEqual({
      '@alias/foo': path.join(__dirname, './fixtures/simple-alias/foo.js'),
      '@alias/bar': path.join(__dirname, './fixtures/simple-alias/bar.js'),
    });

    expect(
      normalizeOption({
        alias: {
          '@alias/*': path.join(__dirname, './fixtures/alias'),
          '@alias/foo': path.join(__dirname, './fixtures/fixed_alias/foo.js'),
        },
      }).alias
    ).toEqual({
      '@alias/foo': path.join(__dirname, './fixtures/fixed_alias/foo.js'),
      '@alias/bar': path.join(__dirname, './fixtures/alias/bar.js'),
      '@alias/deep/baz': path.join(__dirname, './fixtures/alias/deep/baz.js'),
    });

    expect(
      normalizeOption({
        alias: {
          '@alias/*': path.join(__dirname, './fixtures/alias'),
        },
      }).alias
    ).toEqual({
      '@alias/foo': path.join(__dirname, './fixtures/alias/foo.js'),
      '@alias/deep/baz': path.join(__dirname, './fixtures/alias/deep/baz.js'),
      '@alias/bar': path.join(__dirname, './fixtures/alias/bar.js'),
    });
  });

  it('should escape namespace', () => {
    expect(escapeNamespace([])).toEqual(/^$/);
    expect(escapeNamespace(['foo', 'bar'])).toEqual(/^foo|bar$/);
    expect(escapeNamespace(['foobar'])).toEqual(/^foobar$/);
  });
});

describe('aliasPath', () => {
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
