import { snowpackPluginGraphqlImport } from './snowpack-plugin-graphql-import';

describe('snowpackPluginGraphqlImport', () => {
  it('should work', () => {
    expect(snowpackPluginGraphqlImport()).toEqual(
      'snowpack-plugin-graphql-import'
    );
  });
});
