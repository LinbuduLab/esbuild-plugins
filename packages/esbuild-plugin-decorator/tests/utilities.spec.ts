import { findDecorators } from '../src/lib/find-decorator';
import {
  ESBuildPluginDecoratorOptions,
  normalizeOption,
} from '../src/lib/normalize-option';
import path from 'path';

describe('should find decorators', () => {
  it('should find decorators', () => {
    expect(
      findDecorators(`
@Deco()
class Foo {}
`)
    ).toBeTruthy();

    expect(findDecorators(`class Foo {}`)).toBeFalsy();

    expect(findDecorators('')).toBeFalsy();
  });
});

const FIXTURES = path.resolve(__dirname, './fixtures');

describe('should normalize options', () => {
  it('should use default options', () => {
    expect(normalizeOption({})).toStrictEqual({
      cwd: process.cwd(),
      tsconfigPath: path.resolve(process.cwd(), 'tsconfig.json'),
      swcrcPath: path.resolve(process.cwd(), '.swcrc'),
      tscCompilerOptions: {},
      swcCompilerOptions: {},
      force: false,
      verbose: false,
      compiler: 'tsc',
    } as Required<ESBuildPluginDecoratorOptions>);
  });

  it('should resolve options', () => {
    expect(
      normalizeOption({
        cwd: FIXTURES,
        tsconfigPath: 'tsconfig.json',
        swcrcPath: '.swcrc',
        compiler: 'swc',
        force: true,
        verbose: true,
      })
    ).toStrictEqual({
      cwd: FIXTURES,
      tsconfigPath: path.resolve(FIXTURES, 'tsconfig.json'),
      swcrcPath: path.resolve(FIXTURES, '.swcrc'),
      tscCompilerOptions: {},
      swcCompilerOptions: {},
      force: true,
      verbose: true,
      compiler: 'swc',
    } as Required<ESBuildPluginDecoratorOptions>);
  });

  it('should throw when tsconfig file not found', () => {
    expect(() => {
      normalizeOption({
        cwd: FIXTURES,
        tsconfigPath: 'tsconfig.not.json',
        swcrcPath: '.swcrc',
        compiler: 'swc',
        force: true,
        verbose: true,
      });
    }).toThrow();
  });
});
