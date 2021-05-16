import { parcelPluginCleanup } from './parcel-plugin-cleanup';

describe('parcelPluginCleanup', () => {
  it('should work', () => {
    expect(parcelPluginCleanup()).toEqual('parcel-plugin-cleanup');
  });
});
