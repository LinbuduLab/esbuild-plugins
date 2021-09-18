import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('nx-plugin-astro e2e', () => {
  it('should create nx-plugin-astro', async () => {
    const plugin = uniq('nx-plugin-astro');
    ensureNxProject('@nps/nx-plugin-astro', 'dist/packages/nx-plugin-astro');
    await runNxCommandAsync(
      `generate @nps/nx-plugin-astro:nx-plugin-astro ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('nx-plugin-astro');
      ensureNxProject('@nps/nx-plugin-astro', 'dist/packages/nx-plugin-astro');
      await runNxCommandAsync(
        `generate @nps/nx-plugin-astro:nx-plugin-astro ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async () => {
      const plugin = uniq('nx-plugin-astro');
      ensureNxProject('@nps/nx-plugin-astro', 'dist/packages/nx-plugin-astro');
      await runNxCommandAsync(
        `generate @nps/nx-plugin-astro:nx-plugin-astro ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
