import { rollupPluginStaticServe } from './rollup-plugin-static-serve';

describe('rollupPluginStaticServe', () => {
  it('should work', () => {
    expect(rollupPluginStaticServe()).toEqual('rollup-plugin-static-serve');
  });
});
