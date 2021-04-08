import { esbuildPluginNodeExternals } from './esbuild-plugin-node-externals';

describe('esbuildPluginNodeExternals', () => {
  it('should work', () => {
    expect(esbuildPluginNodeExternals()).toEqual(
      'esbuild-plugin-node-externals'
    );
  });
});
