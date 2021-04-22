import { transformSync, Output, Options } from '@swc/core';

// TODO: Support .swcrc config file
export function parseSWCConfig(swcrcPath: string, cwd: string) {
  void 0;
}

export const defaultSWCCompilerOptions: Options = {
  swcrc: false,
  module: {
    type: 'commonjs',
    strict: false,
    lazy: false,
    noInterop: false,
  },

  isModule: true,
  jsc: {
    target: 'es5',
    externalHelpers: false,
    // more efficient code
    loose: true,
    // ts parser or es parser
    parser: {
      syntax: 'typescript',
      tsx: false,
      decorators: true,
      dynamicImport: false,
    },
    transform: {
      decoratorMetadata: true,
    },
  },
};

export function swcCompiler(source: string, options: Options): Output {
  const swcOutput = transformSync(source, options);

  return swcOutput;
}
