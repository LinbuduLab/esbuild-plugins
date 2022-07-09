import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('nx-plugin-demo e2e', () => {
  it('should create nx-plugin-demo', async () => {
    const plugin = uniq('nx-plugin-demo');
    console.log('plugin', plugin);
    ensureNxProject(
      '@nx-plugins/nx-plugin-demo',
      'dist/packages/nx-plugin-demo'
    );
    console.log('ensureNxProject ---->>>>');
    await runNxCommandAsync(
      `generate @nx-plugins/nx-plugin-demo:nx-plugin-demo ${plugin}`
    );

    console.log('runNxCommandAsync ---->>>>');

    const result = await runNxCommandAsync(`build ${plugin}`);

    console.log('runNxCommandAsync ---->>>>', result);

    expect(result.stdout).toContain('Executor ran');
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('nx-plugin-demo');
      ensureNxProject(
        '@nx-plugins/nx-plugin-demo',
        'dist/packages/nx-plugin-demo'
      );
      await runNxCommandAsync(
        `generate @nx-plugins/nx-plugin-demo:nx-plugin-demo ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const plugin = uniq('nx-plugin-demo');
      ensureNxProject(
        '@nx-plugins/nx-plugin-demo',
        'dist/packages/nx-plugin-demo'
      );
      await runNxCommandAsync(
        `generate @nx-plugins/nx-plugin-demo:nx-plugin-demo ${plugin} --tags e2etag,e2ePackage`
      );
      const project = readJson(`libs/${plugin}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
