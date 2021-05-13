import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('nx-plugin-dumi e2e', () => {
  it('should create nx-plugin-dumi', async (done) => {
    const plugin = uniq('nx-plugin-dumi');
    ensureNxProject('@penumbra/nx-plugin-dumi', 'dist/packages/nx-plugin-dumi');
    await runNxCommandAsync(
      `generate @penumbra/nx-plugin-dumi:nx-plugin-dumi ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('nx-plugin-dumi');
      ensureNxProject(
        '@penumbra/nx-plugin-dumi',
        'dist/packages/nx-plugin-dumi'
      );
      await runNxCommandAsync(
        `generate @penumbra/nx-plugin-dumi:nx-plugin-dumi ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('nx-plugin-dumi');
      ensureNxProject(
        '@penumbra/nx-plugin-dumi',
        'dist/packages/nx-plugin-dumi'
      );
      await runNxCommandAsync(
        `generate @penumbra/nx-plugin-dumi:nx-plugin-dumi ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});
