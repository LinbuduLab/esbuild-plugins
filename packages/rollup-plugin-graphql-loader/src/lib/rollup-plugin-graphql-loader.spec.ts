import { rollupPluginGraphqlLoader } from './rollup-plugin-graphql-loader';

describe('rollupPluginGraphqlLoader', () => {
  it('should work', () => {
    expect(rollupPluginGraphqlLoader()).toEqual('rollup-plugin-graphql-loader');
  });
});
