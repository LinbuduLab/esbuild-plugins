import { vitePluginPrisma } from './vite-plugin-prisma';

describe('vitePluginPrisma', () => {
  it('should work', () => {
    expect(vitePluginPrisma()).toEqual('vite-plugin-prisma');
  });
});
