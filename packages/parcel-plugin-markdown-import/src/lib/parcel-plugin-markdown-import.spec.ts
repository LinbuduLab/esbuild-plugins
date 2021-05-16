import { parcelPluginMarkdownImport } from './parcel-plugin-markdown-import';

describe('parcelPluginMarkdownImport', () => {
  it('should work', () => {
    expect(parcelPluginMarkdownImport()).toEqual(
      'parcel-plugin-markdown-import'
    );
  });
});
