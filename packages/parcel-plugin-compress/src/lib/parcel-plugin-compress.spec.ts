import { parcelPluginCompress } from './parcel-plugin-compress';

describe('parcelPluginCompress', () => {
  it('should work', () => {
    expect(parcelPluginCompress()).toEqual('parcel-plugin-compress');
  });
});
