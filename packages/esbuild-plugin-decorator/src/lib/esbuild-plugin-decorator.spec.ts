import { esbuildPluginDecorator } from './esbuild-plugin-decorator';

describe('esbuildPluginDecorator', () => {
  it('should work', () => {
    expect(esbuildPluginDecorator()).toEqual('esbuild-plugin-decorator');
  });
});
