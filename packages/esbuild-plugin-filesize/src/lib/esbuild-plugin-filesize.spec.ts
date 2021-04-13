import { esbuildPluginFilesize } from './esbuild-plugin-filesize';

describe('esbuildPluginFilesize', () => {
  it('should work', () => {
    expect(esbuildPluginFilesize()).toEqual('esbuild-plugin-filesize');
  });
});
