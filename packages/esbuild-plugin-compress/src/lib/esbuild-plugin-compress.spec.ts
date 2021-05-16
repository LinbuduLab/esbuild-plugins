import { esbuildPluginCompress } from './esbuild-plugin-compress';

describe('esbuildPluginCompress', () => {
  it('should work', () => {
    expect(esbuildPluginCompress()).toEqual('esbuild-plugin-compress');
  });
});
