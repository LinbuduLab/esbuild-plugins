import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('nx-plugin-folio e2e', () => {
  it('should create nx-plugin-folio', async (done) => {
    const plugin = uniq('nx-plugin-folio');
    ensureNxProject(
      '@penumbra/nx-plugin-folio',
      'dist/packages/nx-plugin-folio'
    );
    await runNxCommandAsync(
      `generate @penumbra/nx-plugin-folio:nx-plugin-folio ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('nx-plugin-folio');
      ensureNxProject(
        '@penumbra/nx-plugin-folio',
        'dist/packages/nx-plugin-folio'
      );
      await runNxCommandAsync(
        `generate @penumbra/nx-plugin-folio:nx-plugin-folio ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('nx-plugin-folio');
      ensureNxProject(
        '@penumbra/nx-plugin-folio',
        'dist/packages/nx-plugin-folio'
      );
      await runNxCommandAsync(
        `generate @penumbra/nx-plugin-folio:nx-plugin-folio ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});
