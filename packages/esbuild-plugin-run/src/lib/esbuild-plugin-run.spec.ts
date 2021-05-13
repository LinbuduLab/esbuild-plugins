import { esbuildPluginRun } from './esbuild-plugin-run';

describe('esbuildPluginRun', () => {
  it('should work', () => {
    expect(esbuildPluginRun()).toEqual('esbuild-plugin-run');
  });
});
