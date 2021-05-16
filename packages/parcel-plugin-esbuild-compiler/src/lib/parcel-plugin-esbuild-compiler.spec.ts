import { parcelPluginEsbuildCompiler } from './parcel-plugin-esbuild-compiler';

describe('parcelPluginEsbuildCompiler', () => {
  it('should work', () => {
    expect(parcelPluginEsbuildCompiler()).toEqual(
      'parcel-plugin-esbuild-compiler'
    );
  });
});
