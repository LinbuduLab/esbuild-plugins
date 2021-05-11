import { snowpackPluginHashGen } from './snowpack-plugin-hash-gen';

describe('snowpackPluginHashGen', () => {
  it('should work', () => {
    expect(snowpackPluginHashGen()).toEqual('snowpack-plugin-hash-gen');
  });
});
