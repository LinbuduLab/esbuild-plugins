import { esbuildPluginNodePolyfill } from './esbuild-plugin-node-polyfill';

describe('esbuildPluginNodePolyfill', () => {
  it('should work', () => {
    expect(esbuildPluginNodePolyfill()).toEqual('esbuild-plugin-node-polyfill');
  });
});
