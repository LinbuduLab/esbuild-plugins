// These dependencies should be add to [peerDependencies] field
// Dep packages from this repo will add to [dependencies] field by
// --buildableProjectDepsInPackageJsonType=dependencies flag
export const PRESERVED_PACKAGE_PEER_DEPS = [
  // TODO: 对于这些peerDeps 如果没有导入 就不会生成到最终的deps中
  // 要么在文档中提示添加 要么用个对象专门存放这个关系 添加到最终的生成依赖中
  // nx-plugin-typegraphql
  'reflect-metadata',
  'graphql',
  'type-graphql',
  // nx-plugin-esbuild
  'esbuild',
  // nx-plugin-vite
  'vite',
  '@vitejs/plugin-react-refresh',
  '@vitejs/plugin-vue',
  // nx-plugin-prisma
  'prisma',
  '@prisma/client',
  // nx-plugin-koa
  'koa',
  'routing-controllers',
  // nx-plugin-swc
  '@swc/core',
  // nx-plugin-vitepress
  'vitepress',
  // nx-plugin-parcel
  'parcel',
  // nx-plugin-rollup
  'rollup',
  // nx-plugin-umi
  'umi',
  // nx-plugin-midway
  'midway',
  'midway-bin',
  // nx-plugin-snowpack
  'snowpack',
  // shared
  'typescript',
  'webpack',
  'webpack-dev-server',
  'tslib',
];

export const PRESERVED_NX_PEER_DEPS = [
  '@nrwl/jest',
  '@nrwl/cypress',
  '@nrwl/nest',
  '@nrwl/node',
  '@nrwl/linter',
  '@nrwl/workspace',
  '@nrwl/devkit',
  '@nrwl/tao',
  '@nrwl/cli',
];
