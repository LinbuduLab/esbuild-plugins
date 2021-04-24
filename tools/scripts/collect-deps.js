// 遍历package下所有.ts文件
// import语句（AST或正则）
// 移除. ..开头 或 项目内包名的依赖
// 去重
// 写入到package/xxx/package.json
// （暂时全写入到deps）+ @nrwl/devkit
// （内置一批写入到peerDeps的）
// @nrwl/ cypress/jest/linter/node/workspace/
// koa midway esbuild vite snowpack umi prisma @prisma/client typegraphql swc
const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const inquirer = require('inquirer');
const { Project } = require('ts-morph');
const prettier = require('prettier');
const sortPackageJson = require('sort-package-json');
const glob = require('glob');
const { builtinModules } = require('module');
const jsonfile = require('jsonfile');

// TODO: 思考 @vite @midway 这种的依赖如何处置
// TODO: peer

const PRESERVED_INTEGRATION_PEER_DEPS = ['typegraphql', 'esbuild'];

const PRESERVED_NX_DEPS = [
  '@nrwl/jest',
  '@nrwl/cypress',
  '@nrwl/nest',
  '@nrwl/node',
  '@nrwl/linter',
  '@nrwl/workspace',
  '@nrwl/tao',
  '@nrwl/cli',
  '@nrwl/devkit',
];

const allPackages = fs.readdirSync(path.resolve(process.cwd(), 'packages'));

// TODO: snowpack vite umi plugins
const esbuildPlugins = allPackages.filter((package) =>
  package.startsWith('esbuild-plugin-')
);

const PRESERVED_DEPS = [
  ...PRESERVED_INTEGRATION_PEER_DEPS,
  // ...PRESERVED_NX_DEPS,
  ...esbuildPlugins,
  'nx-plugin-devkit',
];

const tmpProjectPath = path.resolve(
  process.cwd(),
  'packages',
  'nx-plugin-esbuild'
);

const tmpProjectPkgFilePath = path.resolve(tmpProjectPath, 'package.json');

const deps = [];

const globbedFiles = glob.sync('**/*.ts', {
  cwd: tmpProjectPath,
});

const project = new Project({
  tsConfigFilePath: path.resolve(tmpProjectPath, 'tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
});

globbedFiles.forEach((file) => {
  // console.log(`=== ${file} ===`);
  const sourceFile = project.createSourceFile(
    path.resolve(tmpProjectPath, file),
    fs.readFileSync(path.resolve(tmpProjectPath, file), 'utf8'),
    { overwrite: true }
  );
  sourceFile.getImportDeclarations().map((declaration) => {
    if (!declaration.isModuleSpecifierRelative()) {
      deps.push(declaration.getModuleSpecifierValue());
    }
  });
});

const filteredDeps = Array.from(new Set(deps))
  .filter(
    (dep) =>
      !PRESERVED_DEPS.includes(dep) &&
      // @nrwl/workspace/src/utilities/run-tasks-in-serial
      PRESERVED_DEPS.every((preservedDeps) => !dep.startsWith(preservedDeps))
  )
  // FIXME: 保留 @nrwl/devkit 但不保留@nrwl/workspace/src/utilities/xxx
  .filter(
    (dep) =>
      !dep.includes('utilities') &&
      !dep.includes('operators') &&
      !builtinModules.includes(dep)
  );

console.log('filteredDeps: ', filteredDeps);

// TODO: get package version from root package.json

const pkgDepsField = {
  dependencies: {},
};

filteredDeps.forEach((dep) => {
  pkgDepsField.dependencies[dep] = 'latest';
});

// console.log('pkgDepsField: ', pkgDepsField);

const projectPkgContent = jsonfile.readFileSync(tmpProjectPkgFilePath, {
  encoding: 'utf8',
});

const projectDeps = projectPkgContent.dependencies;

let tmp = {};

// TODO: merge deps devDeps peerDeps
tmp = {
  ...projectDeps.dependencies,
  ...pkgDepsField.dependencies,
};
// console.log('tmp: ', tmp);

const overwrite = {
  ...projectPkgContent,
  dependencies: {
    ...projectPkgContent.dependencies,
    ...tmp,
  },
};

// console.log('overwrite: ', overwrite);

fs.writeFileSync(
  tmpProjectPkgFilePath,
  prettier.format(sortPackageJson(JSON.stringify(overwrite)), {
    parser: 'json',
  })
);
