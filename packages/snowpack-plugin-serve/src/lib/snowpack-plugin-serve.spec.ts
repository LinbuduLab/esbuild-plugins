import { snowpackPluginServe } from './snowpack-plugin-serve';

describe('snowpackPluginServe', () => {
  it('should work', () => {
    expect(snowpackPluginServe()).toEqual('snowpack-plugin-serve');
  });
});
