import { esbuildPluginMarkdownImport } from './esbuild-plugin-markdown-import';

describe('esbuildPluginMarkdownImport', () => {
  it('should work', () => {
    expect(esbuildPluginMarkdownImport()).toEqual(
      'esbuild-plugin-markdown-import'
    );
  });
});
