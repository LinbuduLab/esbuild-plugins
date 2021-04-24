import { esbuildPluginNotifier } from './esbuild-plugin-notifier';

describe('esbuildPluginNotifier', () => {
  it('should work', () => {
    expect(esbuildPluginNotifier()).toEqual('esbuild-plugin-notifier');
  });
});
