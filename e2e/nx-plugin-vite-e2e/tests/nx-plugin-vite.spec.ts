import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('nx-plugin-vite e2e', () => {
  it('should create app', async () => {
    const appName = uniq('app');
    ensureNxProject('nx-plugin-vite', 'packages/nx-plugin-vite');
    await runNxCommandAsync(`generate nx-plugin-vite:app ${appName}`);
    const result = await runNxCommandAsync(`build ${appName}`);
    console.log('result: ', result);
    // expect(result.stdout).toContain('Executor ran');
  }, 120000);

  // describe('--directory', () => {
  //   it('should create src in the specified directory', async () => {
  //     const plugin = uniq('nx-plugin-vite');
  //     ensureNxProject('@nps/nx-plugin-vite', 'dist/packages/nx-plugin-vite');
  //     await runNxCommandAsync(
  //       `generate @nps/nx-plugin-vite:nx-plugin-vite ${plugin} --directory subdir`
  //     );
  //     expect(() =>
  //       checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
  //     ).not.toThrow();
  //   }, 120000);
  // });
  // describe('--tags', () => {
  //   it('should add tags to nx.json', async () => {
  //     const plugin = uniq('nx-plugin-vite');
  //     ensureNxProject('@nps/nx-plugin-vite', 'dist/packages/nx-plugin-vite');
  //     await runNxCommandAsync(
  //       `generate @nps/nx-plugin-vite:nx-plugin-vite ${plugin} --tags e2etag,e2ePackage`
  //     );
  //     const nxJson = readJson('nx.json');
  //     expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
  //   }, 120000);
  // });
});
