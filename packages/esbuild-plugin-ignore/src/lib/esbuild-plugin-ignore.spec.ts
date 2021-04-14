import { esbuildPluginIgnore } from './esbuild-plugin-ignore';

describe('esbuildPluginIgnore', () => {
  it('should work', () => {
    expect(esbuildPluginIgnore()).toEqual('esbuild-plugin-ignore');
  });
});
