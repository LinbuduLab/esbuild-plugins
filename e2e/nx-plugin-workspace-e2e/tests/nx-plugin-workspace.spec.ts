import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('nx-plugin-workspace e2e', () => {
  it('should create nx-plugin-workspace', async (done) => {
    const plugin = uniq('nx-plugin-workspace');
    ensureNxProject(
      '@penumbra/nx-plugin-workspace',
      'dist/packages/nx-plugin-workspace'
    );
    await runNxCommandAsync(
      `generate @penumbra/nx-plugin-workspace:nx-plugin-workspace ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('nx-plugin-workspace');
      ensureNxProject(
        '@penumbra/nx-plugin-workspace',
        'dist/packages/nx-plugin-workspace'
      );
      await runNxCommandAsync(
        `generate @penumbra/nx-plugin-workspace:nx-plugin-workspace ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('nx-plugin-workspace');
      ensureNxProject(
        '@penumbra/nx-plugin-workspace',
        'dist/packages/nx-plugin-workspace'
      );
      await runNxCommandAsync(
        `generate @penumbra/nx-plugin-workspace:nx-plugin-workspace ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});
