import { esbuildPluginSvgrImport } from './esbuild-plugin-svgr-import';

describe('esbuildPluginSvgrImport', () => {
  it('should work', () => {
    expect(esbuildPluginSvgrImport()).toEqual('esbuild-plugin-svgr-import');
  });
});
