import { rollupPluginEsbuildCompiler } from './rollup-plugin-esbuild-compiler';

describe('rollupPluginEsbuildCompiler', () => {
  it('should work', () => {
    expect(rollupPluginEsbuildCompiler()).toEqual(
      'rollup-plugin-esbuild-compiler'
    );
  });
});
