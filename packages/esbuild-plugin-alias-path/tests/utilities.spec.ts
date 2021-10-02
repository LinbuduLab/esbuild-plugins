import path from 'path';
import { normalizeOption } from '../src/lib/normalize-options';
import { loadCompilerOptions } from '../src/lib/load-compiler-options';
import { escapeNamespace } from '../src/lib/esbuild-plugin-alias-path';

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
          '@alias/foo': path.join(__dirname, './fixtures/fixed_alias/foo.js'),
          '@alias/*': path.join(__dirname, './fixtures/alias'),
        },
      }).alias
    ).toStrictEqual({
      '@alias/foo': path.join(__dirname, './fixtures/fixed_alias/foo.js'),
      '@alias/bar': path.join(__dirname, './fixtures/alias/bar.js'),
    });

    expect(
      normalizeOption({
        alias: {
          '@alias/*': path.join(__dirname, './fixtures/alias'),
        },
      }).alias
    ).toStrictEqual({
      '@alias/foo': path.join(__dirname, './fixtures/alias/foo.js'),
      '@alias/bar': path.join(__dirname, './fixtures/alias/bar.js'),
    });
  });

  it('should escape namespace', () => {
    expect(escapeNamespace([])).toStrictEqual(/^$/);
    expect(escapeNamespace(['foo', 'bar'])).toStrictEqual(/^foo|bar$/);
    expect(escapeNamespace(['foobar'])).toStrictEqual(/^foobar$/);
  });
});
