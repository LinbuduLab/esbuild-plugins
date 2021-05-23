import { normalizeOption, NormalizedOptions } from './normalize-options';
import path from 'path';

describe('should normalize option correctly', () => {
  it('should use default value when receive empty object', () => {
    const normalizedOptions = normalizeOption({});
    expect(normalizedOptions).toEqual({
      alias: {},
      tsconfigPath: undefined,
      compilerOptions: {},
      skip: true,
    } as NormalizedOptions);
  });

  it('should return correct value', () => {
    const tsconfigPath = path.resolve(
      'packages',
      'esbuild-plugin-alias-path',
      'tsconfig.json'
    );
    const normalizedOptions = normalizeOption({
      alias: {
        foo: 'bar',
      },
      tsconfigPath: tsconfigPath,
    });

    expect(normalizedOptions).toEqual({
      alias: {
        foo: 'bar',
      },
      tsconfigPath: tsconfigPath,
      compilerOptions: {},
      skip: false,
    } as NormalizedOptions);
  });

  it('should throw error when tsconfig inexist', () => {
    const inexistPath = path.join(
      process.cwd(),
      'packages',
      'inexist-package',
      'tsconfig.json'
    );

    try {
      expect(
        normalizeOption({
          tsconfigPath: inexistPath,
        })
      ).toThrowError(
        `[esbuild-plugin-alias-path] tsconfig ${inexistPath} does not exist.`
      );
    } catch (error) {}
  });
});
