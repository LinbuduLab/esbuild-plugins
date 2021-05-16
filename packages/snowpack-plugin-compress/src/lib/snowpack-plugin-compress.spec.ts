import { snowpackPluginCompress } from './snowpack-plugin-compress';

describe('snowpackPluginCompress', () => {
  it('should work', () => {
    expect(snowpackPluginCompress()).toEqual('snowpack-plugin-compress');
  });
});
