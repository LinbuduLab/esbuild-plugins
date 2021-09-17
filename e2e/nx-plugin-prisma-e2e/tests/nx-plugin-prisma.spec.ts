import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('nx-plugin-prisma e2e', () => {
  it('should create nx-plugin-prisma', async () => {
    const plugin = uniq('nx-plugin-prisma');
    ensureNxProject('@nps/nx-plugin-prisma', 'dist/packages/nx-plugin-prisma');
    await runNxCommandAsync(
      `generate @nps/nx-plugin-prisma:nx-plugin-prisma ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('nx-plugin-prisma');
      ensureNxProject(
        '@nps/nx-plugin-prisma',
        'dist/packages/nx-plugin-prisma'
      );
      await runNxCommandAsync(
        `generate @nps/nx-plugin-prisma:nx-plugin-prisma ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async () => {
      const plugin = uniq('nx-plugin-prisma');
      ensureNxProject(
        '@nps/nx-plugin-prisma',
        'dist/packages/nx-plugin-prisma'
      );
      await runNxCommandAsync(
        `generate @nps/nx-plugin-prisma:nx-plugin-prisma ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
