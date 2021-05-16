import { snowpackPluginTsconfigPaths } from './snowpack-plugin-tsconfig-paths';

describe('snowpackPluginTsconfigPaths', () => {
  it('should work', () => {
    expect(snowpackPluginTsconfigPaths()).toEqual(
      'snowpack-plugin-tsconfig-paths'
    );
  });
});
