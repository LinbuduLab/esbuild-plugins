import { esbuildPluginAliasPath } from './esbuild-plugin-alias-path';

describe('esbuildPluginAliasPath', () => {
  it('should work', () => {
    expect(esbuildPluginAliasPath()).toEqual('esbuild-plugin-alias-path');
  });
});
