import { transformSync, Output, Options } from '@swc/core';
import jsonfile from 'jsonfile';

export const defaultSWCCompilerOptions: Options = {
  swcrc: false,
  module: {
    type: 'commonjs',
    strict: false,
    lazy: false,
    noInterop: false,
  },
  minify: true,
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

// not using configFile option
export function swcCompiler(source: string, options: Options): Output {
  const swcOutput = transformSync(source, options);

  return swcOutput;
}

export function parseSWCConfig(swcrcPath: string) {
  try {
    const swcrcConfig = jsonfile.readFileSync(swcrcPath, 'utf8');
    return swcrcConfig;
  } catch (error) {
    return {};
  }
}
