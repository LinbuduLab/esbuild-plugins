import path from 'path';
import { normalizeOption } from '../src/lib/normalize-options';
import { loadCompilerOptions } from '../src/lib/load-compiler-options';
import { escapeNamespace } from '../src/lib/escape-namespace';

const tsconfigPath = path.resolve(__dirname, './fixtures/tsconfig.json');
const tsconfigEmptyPath = path.resolve(
  __dirname,
  './fixtures/tsconfig.empty-path.json'
);

describe('should normalize options', () => {
  it('should skip only when no alias / patn configurated or set option.skip', () => {
    expect(
      normalizeOption({
        alias: {},
        tsconfigPath,
      }).skip
    ).toBeFalsy();

    expect(
      normalizeOption({
        alias: {
          '@foo': 'bar',
        },
      }).skip
    ).toBeFalsy();

    expect(
      normalizeOption({
        alias: {},
        tsconfigPath: tsconfigEmptyPath,
      }).skip
    ).toBeTruthy();

    expect(
      normalizeOption({
        skip: true,
      }).skip
    ).toBeTruthy();
  });

  it('should load compiler options', () => {
    expect(loadCompilerOptions(tsconfigPath).paths).toEqual({
      '@alias/*': ['./alias/*'],
    });

    expect(loadCompilerOptions(tsconfigEmptyPath).paths).toBeUndefined();

    expect(
      normalizeOption({
        tsconfigPath,
      }).compilerOptions.paths
    ).toEqual({
      '@alias/*': ['./alias/*'],
    });

    expect(
      normalizeOption({
        tsconfigPath: tsconfigEmptyPath,
      }).compilerOptions.paths
    ).toBeUndefined();
  });

  it('should escape namespace', () => {
    expect(escapeNamespace([])).toStrictEqual(/^$/);
    expect(escapeNamespace(['foo', 'bar'])).toStrictEqual(/^foo|bar$/);
    expect(escapeNamespace(['foobar'])).toStrictEqual(/^foobar$/);
  });
});
