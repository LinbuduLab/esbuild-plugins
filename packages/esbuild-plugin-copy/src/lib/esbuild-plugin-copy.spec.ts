import { esbuildPluginCopy } from './esbuild-plugin-copy';

describe('esbuildPluginCopy', () => {
  it('should work', () => {
    expect(esbuildPluginCopy()).toEqual('esbuild-plugin-copy');
  });
});
