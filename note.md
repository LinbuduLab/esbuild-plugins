# note

## progress

aaaa!

## commands

- nx list @penumbra/nx-plugin-typegraphql
- (dist 目录) pnpm link @penumbra/nx-plugin-typegraphql
- packages 下多个 plugin？ nx-plugin-typegraphql nx-plugin-midway nx-plugin-prisma
- nx generate @nrwl/nx-plugin:executor [executor] --project=[pluginName]
- nx generate @nrwl/nx-plugin:generator [generatorName] --project=[pluginName]
- nx run nx-plugin-typegraphql:build
- nx g @penumbra/nx-plugin-typegraphql:objecttype
- nx g @nrwl/nx-plugin:plugin [pluginName]

## executors

- nx g @nrwl/nx-plugin:executor my-executor --project=my-plugin
- 在 workspace.json project.targets 中添加
- \[packageName]:\[command]
- 需要 executor 的：esbuild swc prisma midway serverless vite
- --buildableProjectDepsInPackageJsonType=dependencies

## esbuild

- executor:build(tsc)
- executor:serve(etsc)
- generator:setup；为已经存在的项目，新增 esbuild-build 命令，使用 nx-plugin-esbuild:build 进行构建，新增 esbuild-serve 命令，使用 nx-plugin-esbuild:serve
- generator:init：创建一个全新的项目

## issues

- File 'D:/nx-plugin-typegraphql/packages/esbuild-plugin-decorator/src/lib/parse-config.ts' is not under 'rootDir' 'packages/nx-plugin-esbuild'. 'rootDir' is expected to contain all source files.
- https://github.com/nrwl/nx/blob/master/packages/node/src/executors/package/schema.json
- submodule: (publishable) 要 cd 到 nx-plugin-esbuild 然后 pnpm link esbuild-plugin-node-externals

- https://github.com/nrwl/nx/issues/2794
- File 'D:/nx-plugin-typegraphql/packages/esbuild-plugin-decorator/src/lib/parse-config.ts' is not under 'rootDir' 'packages/nx-plugin-esbuild'. 'rootDir' is expected to contain all source files.

  - https://github.com/nrwl/nx/blob/master/packages/node/src/executors/package/schema.json
  - https://nx.dev/latest/angular/structure/buildable-and-publishable-libraries
  - https://github.com/nrwl/nx/issues/4620
  - nx build nx-plugin-esbuild --with-deps
  - nx g @nrwl/node:lib esbuild-plugin-decorator --publishable --importPath=esbuild-plugin-decorator

- nx koa-build nest-app --configuration=production
- ts-node 参数顺序 https://github.com/TypeStrong/ts-node/issues/541
