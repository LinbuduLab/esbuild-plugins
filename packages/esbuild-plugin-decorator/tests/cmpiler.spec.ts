import { swcCompiler, parseSWCConfig } from '../src/lib/swc-compiler';
import { tscCompiler, parseTsConfig } from '../src/lib/tsc-compiler';
import path from 'path';
import fs from 'fs-extra';
import tmp from 'tmp';

const input = fs.readFileSync(
  path.resolve(__dirname, './fixtures/input.ts'),
  'utf-8'
);

const cwd = path.resolve(__dirname, './fixtures');

describe('should compile by swc', () => {
  it('should parse config', () => {
    expect(
      parseSWCConfig(path.resolve(__dirname, './fixtures/.swcrc'))
    ).toStrictEqual({
      jsc: {
        parser: {
          syntax: 'typescript',
          decorators: true,
          tsx: false,
          dynamicImport: false,
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
        target: 'es5',
        loose: false,
        externalHelpers: false,
        keepClassNames: false,
      },
    });

    expect(
      parseSWCConfig(path.resolve(__dirname, './fixtures/.swcrc-not-exist'))
    ).toStrictEqual({});
  });
  it('should compile file', () => {
    const outFile = tmp.fileSync();
    const output = swcCompiler(input, {
      jsc: {
        target: 'es5',
        parser: {
          syntax: 'typescript',
          tsx: false,
          decorators: true,
        },
      },
      root: cwd,
    });

    expect(output.code.length).toBeGreaterThan(10);
    expect(output.code).toContain('ClassDeco');
  });
});

describe('should compile by tsc', () => {
  it('should parse ts config', () => {
    expect(
      parseTsConfig(path.resolve(__dirname, './fixtures/tsconfig.json'), cwd)
        .raw
    ).toStrictEqual({
      compileOnSave: false,
      compilerOptions: {
        sourceMap: false,
        outDir: 'dist',
        declaration: true,
        importHelpers: false,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        moduleResolution: 'node',
        target: 'es2015',
        module: 'CommonJS',
        lib: ['esnext', 'dom'],
        esModuleInterop: true,
        skipLibCheck: true,
        skipDefaultLibCheck: true,
        baseUrl: '.',
        rootDir: '.',
      },
      include: ['input.ts'],
    });
  });
  it('should parse by tsc', () => {
    const options = parseTsConfig(
      path.resolve(__dirname, './fixtures/tsconfig.json'),
      cwd
    ).raw;

    const output = tscCompiler(input, { ...options });

    expect(output.outputText.length).toBeGreaterThan(10);
    expect(output.outputText).toContain('ClassDeco');
  });
});
