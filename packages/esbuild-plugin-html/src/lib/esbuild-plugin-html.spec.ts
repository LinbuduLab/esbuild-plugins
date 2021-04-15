import { esbuildPluginHtml } from './esbuild-plugin-html';

describe('esbuildPluginHtml', () => {
  it('should work', () => {
    expect(esbuildPluginHtml()).toEqual('esbuild-plugin-html');
  });
});
