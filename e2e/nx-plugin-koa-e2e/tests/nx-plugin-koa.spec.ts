import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('nx-plugin-koa e2e', () => {
  it('should create nx-plugin-koa', async (done) => {
    const plugin = uniq('nx-plugin-koa');
    ensureNxProject('@penumbra/nx-plugin-koa', 'dist/packages/nx-plugin-koa');
    await runNxCommandAsync(
      `generate @penumbra/nx-plugin-koa:nx-plugin-koa ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('nx-plugin-koa');
      ensureNxProject('@penumbra/nx-plugin-koa', 'dist/packages/nx-plugin-koa');
      await runNxCommandAsync(
        `generate @penumbra/nx-plugin-koa:nx-plugin-koa ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('nx-plugin-koa');
      ensureNxProject('@penumbra/nx-plugin-koa', 'dist/packages/nx-plugin-koa');
      await runNxCommandAsync(
        `generate @penumbra/nx-plugin-koa:nx-plugin-koa ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});
