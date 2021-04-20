import { transformSync, Output } from '@swc/core';

export function swcCompiler(source: string): Output {
  const swcOutput = transformSync(source, {
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
  });

  return swcOutput;
}
