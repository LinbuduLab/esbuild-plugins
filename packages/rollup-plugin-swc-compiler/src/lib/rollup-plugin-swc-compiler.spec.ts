import { rollupPluginSwcCompiler } from './rollup-plugin-swc-compiler';

describe('rollupPluginSwcCompiler', () => {
  it('should work', () => {
    expect(rollupPluginSwcCompiler()).toEqual('rollup-plugin-swc-compiler');
  });
});
