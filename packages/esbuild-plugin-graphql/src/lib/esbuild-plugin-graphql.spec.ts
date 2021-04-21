import { esbuildPluginGraphql } from './esbuild-plugin-graphql';

describe('esbuildPluginGraphql', () => {
  it('should work', () => {
    expect(esbuildPluginGraphql()).toEqual('esbuild-plugin-graphql');
  });
});
