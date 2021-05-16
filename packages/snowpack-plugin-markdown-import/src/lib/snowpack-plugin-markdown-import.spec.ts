import { snowpackPluginMarkdownImport } from './snowpack-plugin-markdown-import';

describe('snowpackPluginMarkdownImport', () => {
  it('should work', () => {
    expect(snowpackPluginMarkdownImport()).toEqual(
      'snowpack-plugin-markdown-import'
    );
  });
});
