import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { Project } from 'ts-morph';
import prettier from 'prettier';
import sortPackageJson from 'sort-package-json';
import { builtinModules } from 'module';
import jsonfile from 'jsonfile';
import glob from 'glob';
import uniq from 'lodash/uniq';

import { createMissingFields } from './fill-package-json';

import {
  PRESERVED_PACKAGE_PEER_DEPS,
  PRESERVED_NX_PEER_DEPS,
} from './constants';
import { collectDepsVersionFromRootPackage } from './collect-dep-version';
import {
  esbuildPlugins,
  vitePlugins,
  umiPlugins,
  parcelPlugins,
  rollupPlugins,
} from '../utils/packages';

export function handler(project: string) {
  console.log(chalk.cyan(`Handling ${project} \n`));

  const projectPath = path.resolve(process.cwd(), 'packages', project);
  const projectPkgFilePath = path.resolve(projectPath, 'package.json');

  const deps: string[] = [];

  const globbedFiles = glob.sync('**/*.ts', {
    cwd: projectPath,
  });

  const morphProject = new Project({
    tsConfigFilePath: path.resolve(projectPath, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  });

  globbedFiles.forEach((file) => {
    const sourceFile = morphProject.createSourceFile(
      path.resolve(projectPath, file),
      fs.readFileSync(path.resolve(projectPath, file), 'utf8'),
      { overwrite: true }
    );
    sourceFile.getImportDeclarations().forEach((declaration) => {
      if (!declaration.isModuleSpecifierRelative()) {
        // this method does exist.
        // @ts-ignore
        deps.push(declaration.getModuleSpecifierValue());
      }
    });
  });

  const deduplicateDpes = uniq(deps);

  // @scope/package/src/folder -> @scope/package
  // package/src/xxx -> package
  // package -> package

  const determineDepType = (dep: string) =>
    [...PRESERVED_NX_PEER_DEPS, ...PRESERVED_PACKAGE_PEER_DEPS].includes(dep);

  // these deps will be added to the package.json in build
  const depsToExlude = [
    ...esbuildPlugins,
    ...vitePlugins,
    ...umiPlugins,
    ...parcelPlugins,
    ...rollupPlugins,
    'nx-plugin-devkit',
    'nx-plugin-workspace',
  ];

  // TODO: optimize by lodash method
  const processedDeps = uniq(
    deduplicateDpes.map((dep) =>
      dep.includes('/')
        ? dep.startsWith('@')
          ? dep.split('/').slice(0, 2).join('/')
          : dep.split('/').shift()
        : dep
    )
  ).filter(
    (dep) => !builtinModules.includes(dep) && !depsToExlude.includes(dep)
  );

  // add to peerDependencies
  const addAsPeerDeps = processedDeps.filter((dep) => determineDepType(dep));
  // add to deps
  const addAsDeps = processedDeps.filter((dep) => !determineDepType(dep));

  const peerDepsWithVersion = collectDepsVersionFromRootPackage(addAsPeerDeps);

  const depsWithVersion = collectDepsVersionFromRootPackage(addAsDeps);

  const depsInfoToAdd = {
    dependencies: depsWithVersion,
    peerDependencies: peerDepsWithVersion,
  };

  const projectPkgContent = jsonfile.readFileSync(projectPkgFilePath, {
    encoding: 'utf8',
  });

  projectPkgContent.dependencies = {
    ...projectPkgContent.dependencies,
    ...depsInfoToAdd.dependencies,
  };

  projectPkgContent.peerDependencies = {
    ...projectPkgContent.peerDependencies,
    ...depsInfoToAdd.peerDependencies,
  };

  fs.writeFileSync(
    projectPkgFilePath,
    prettier.format(
      sortPackageJson(
        JSON.stringify({
          ...projectPkgContent,
          ...createMissingFields(project),
        })
      ),
      {
        parser: 'json',
      }
    )
  );

  console.log(chalk.cyan(`Handled ${project} \n`));
}
